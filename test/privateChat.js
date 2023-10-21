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
            const { privateChat, accountA, accountB, accountC } = await loadFixture(createChatInstance); // deployOneYearLockFixture
            contractPrivateChat = privateChat;
            userA = accountA;
            userB = accountB
            attacker = accountC;
        });

    });
    
});
