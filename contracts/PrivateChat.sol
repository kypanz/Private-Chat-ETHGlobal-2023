// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PrivateChat {

    struct User {
        address addr;
        string pub;
    }

    struct Chat {
        User userA;
        User userB;
        bool isAccepted;
        string[] messages;
    }

    mapping(address => User) users;
    mapping(uint256 => Chat) chats;

    event MessageSended(uint256 _chatId, address _user, string _message);

    uint256 chatId = 0;

    function register(string memory _publicKey) public {
        users[msg.sender] = User({
            addr : msg.sender,
            pub : _publicKey
        });
    }

}