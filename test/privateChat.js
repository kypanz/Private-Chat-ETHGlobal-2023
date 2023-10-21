const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

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
        let userB
        let attacker;
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
            
        });

        it("userA open a chat to userB, and define a secretKey for the chat to start a conversation [ Symmetric ]", async function () {

        });

        it("userB accept the chat", async function () {
            
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
