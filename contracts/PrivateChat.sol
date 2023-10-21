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

    function createChat(address _toUser) public {

        User storage userA = users[msg.sender];
        User storage userB = users[_toUser];
        string[] memory messages;

        chats[chatId] = Chat({
            userA : userA,
            userB : userB,
            isAccepted : false,
            messages : messages
        });

    }

}