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

function encryptAsymmetricMessage(publicKey, message) {
    const encryptedMessage = crypto.publicEncrypt(publicKey, Buffer.from(message));
    return encryptedMessage.toString('base64');
}


describe("Private Chat - Tests", function () {

    async function createChatInstance() {

        const [accountA, accountB, accountC] = await ethers.getSigners();
        const PrivateChat = await ethers.getContractFactory("PrivateChat");
        const privateChat = await PrivateChat.deploy();

        return { privateChat, accountA, accountB, accountC };
    }

    describe("Deployment", function () {

        // Global variables to test all cases
        let userA;
        let userB;
        let attacker;
        let userAkeys = { publicKey, privateKey } = generateAsymmetricKeys();
        let userBkeys = { publicKey, privateKey } = generateAsymmetricKeys();
        let attackerKeys = { publicKey, privateKey } = generateAsymmetricKeys();
        let chatId = 0;
        let contractPrivateChat;

        it("Instanciate the contract and the accounts", async function () {
            const { privateChat, accountA, accountB, accountC } = await loadFixture(createChatInstance);
            contractPrivateChat = privateChat;
            userA = accountA;
            userB = accountB
            attacker = accountC;
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

        it("userA open a chat to userB, and define a secretKey for the chat to start a conversation [ Symmetric ]", async function () {
            const message = encryptAsymmetricMessage(userBkeys.publicKey, 'OsirisIsTheAESKey');
            const response_a = await contractPrivateChat.connect(userA).createChat(userB.address, message);
            const resultMessage = await contractPrivateChat.connect(userA).getMessages(chatId);
            expect(response_a).to.be.not.equal(undefined);
            expect(resultMessage.length > 0).to.be.equal(true);
        });

        it("userB accept the chat", async function () {
            const response_b = await contractPrivateChat.connect(userB).acceptChat(chatId);
            expect(typeof response_b.hash).to.not.be.equal(undefined);
        });

        it("userA and userB can start sending private messages", async function () {
            
        });

        // Handle Some Possible cases
        it("User try to create a chat without register before => Revert", async function () {

        });

        it("UserA try to send a message to UserB, but UserB is not registred => Revert", async function () {

        });

        it("UserA try to send a message to UserB, but UserB don't accept => Revert", async function () {

        });

        it("Attacker try to read a message from another chat => this can se only the encrypted data", async function () {

        });

    });

});
