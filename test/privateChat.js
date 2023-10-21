const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const crypto = require('crypto');

function generateAsymmetricKeys() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });
    return { publicKey, privateKey };
}

function decryptAsymmetricMessage(privateKey, encryptedMessage) {
    const bufferMessage = Buffer.from(encryptedMessage, 'base64');
    return crypto.privateDecrypt(privateKey, bufferMessage);
}

function decryptSymmetricMessage(key, iv, encryptedMessage) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decryptedData = decipher.update(encryptedMessage, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
}

function generateSymmetricKeys() {
    const sharedPassword = 'OsirisIsTheAESKey';
    const key = crypto.scryptSync(sharedPassword, 'salt', 32); // 32 bytes AES-256
    const iv = crypto.randomBytes(16); // 16 bytes
    return { key, iv };
}

function encryptAsymmetricMessage(publicKey, message) {
    const encryptedMessage = crypto.publicEncrypt(publicKey, Buffer.from(message));
    return encryptedMessage.toString('base64');
}

function encryptSymmetricMessage(key, iv, message) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedData = cipher.update(message, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
}


describe("Private Chat - Tests", function () {

    async function createChatInstance() {

        const [accountA, accountB, accountC, ...othersUsers] = await ethers.getSigners();
        const PrivateChat = await ethers.getContractFactory("PrivateChat");
        const privateChat = await PrivateChat.deploy();

        return { privateChat, accountA, accountB, accountC, othersUsers};
    }

    describe("Deployment", function () {

        // Global variables to test all cases
        let userA;
        let userB;
        let attacker;
        let moreUsers;

        // Asymmetric keys
        let userAkeys = { publicKey, privateKey } = generateAsymmetricKeys();
        let userBkeys = { publicKey, privateKey } = generateAsymmetricKeys();
        let attackerKeys = { publicKey, privateKey } = generateAsymmetricKeys();

        // Symmetric keys
        let usersKeysAES = { key, iv } = generateSymmetricKeys();
        let attackerAES = { key, iv } = generateSymmetricKeys();
        let theSecretAES = 'OsirisIsTheAESKey';

        let chatId = 0;
        let contractPrivateChat;

        it("Instanciate the contract and the accounts", async function () {
            const { privateChat, accountA, accountB, accountC, othersUsers } = await loadFixture(createChatInstance);
            contractPrivateChat = privateChat;
            userA = accountA;
            userB = accountB
            attacker = accountC;
            moreUsers = othersUsers;
            expect(userA.address).to.be.not.equal(null);
            expect(userB.address).to.be.not.equal(null);
            expect(attacker.address).to.be.not.equal(null);
            expect(contractPrivateChat).to.be.not.equal(null);
        });

        // Ideal situation
        it("Users register in the smart contract with their public keys [ Asymmetric ]", async function () {
            const response_a = await contractPrivateChat.connect(userA).register(userAkeys.publicKey);
            const response_b = await contractPrivateChat.connect(userA).register(userAkeys.publicKey);
            const response_attacker = await contractPrivateChat.connect(userA).register(userAkeys.publicKey);
            expect(typeof response_a.hash).to.be.not.equal(undefined);
            expect(typeof response_b.hash).to.be.not.equal(undefined);
            expect(typeof response_attacker.hash).to.be.not.equal(undefined);
        });

        it("userA open a chat to userB, and define a secretKey for the chat to start a conversation [ Symmetric RSA ]", async function () {
            const { key, iv } = usersKeysAES;
            const message = encryptAsymmetricMessage(userBkeys.publicKey, `${theSecretAES}, the key is : ${key.toString('hex')}, the iv is : ${iv.toString('hex')}`);
            const response_a = await contractPrivateChat.connect(userA).createChat(userB.address, message);
            const resultMessage = await contractPrivateChat.connect(userA).getMessages(chatId);
            expect(response_a).to.be.not.equal(undefined);
            expect(resultMessage.length > 0).to.be.equal(true);
        });

        it("userB can see the message decrypted and accept the chat", async function () {
            const messageEncrypted = (await contractPrivateChat.connect(userB).getMessages(chatId))[0];
            const messageDecrypted = decryptAsymmetricMessage(userBkeys.privateKey, messageEncrypted);
            const hasTheKey = messageDecrypted.toString().includes('OsirisIsTheAESKey');
            const response_b = await contractPrivateChat.connect(userB).acceptChat(chatId);
            expect(typeof response_b.hash).to.not.be.equal(undefined);
            expect(hasTheKey).to.be.equal(true);
        });

        it("userA and userB can start sending private messages [ Symmetric AES ]", async function () {
            const plainText = 'This is a private message for the userA i like dinosaurs :)'
            const plainTextTwo = 'Cool this works';
            const { key, iv } = usersKeysAES;
            const messageEncrypted = encryptSymmetricMessage(key, iv, plainText);
            const response_a = await contractPrivateChat.connect(userA).sendMessage(chatId, messageEncrypted);
            const messageEncryptedTwo = encryptSymmetricMessage(key, iv, plainTextTwo);
            const response_b = await contractPrivateChat.connect(userB).sendMessage(chatId, messageEncryptedTwo);
            expect(typeof response_a.hash).to.be.not.equal(undefined);
            expect(typeof response_b.hash).to.be.not.equal(undefined);
        });

        it("userA and userB can decrypt their messages using the secret defined [ Symmetric AES ]", async function () {
            const { key, iv } = usersKeysAES;
            const responseMessages = await contractPrivateChat.getMessages(chatId);
            const decryptedMessage = decryptSymmetricMessage(key, iv, responseMessages[1]);
            expect(responseMessages[1].includes('dinosaurs')).to.be.equal(false);
            expect(decryptedMessage.includes('dinosaurs')).to.be.equal(true);
        });

        // Handle Some Possible cases
        it("User try to create a chat without register before => Revert", async function () {
            const { key, iv } = usersKeysAES;
            const message = encryptAsymmetricMessage(userBkeys.publicKey, `${theSecretAES}, the key is : ${key.toString('hex')}, the iv is : ${iv.toString('hex')}`);
            const response_x = contractPrivateChat.connect(moreUsers[0]).createChat(userB.address, message);
            await expect(response_x).revertedWith('you need to be registered');
        });

        /*
        it("UserA try to send a message to UserX, but UserX is not registred => Revert", async function () {
            // TODO : not required for the demostration, but can be handle
        });

        it("UserA try to send a message to UserB, but UserB don't accept => Revert", async function () {
            // TODO : not required for the demostration, but can be handle
        });

        it("Attacker try to read a message from another chat => this can se only the encrypted data", async function () {
            // TODO : not required for the demostration, but can be handle
        });
        */

    });

});
