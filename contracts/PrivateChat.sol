// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PrivateChat {

    struct User {
        string pub;
    }

    struct Chat {
        User userA;
        User userB;
        bool isAccepted;
        string[] messages;
    }

    mapping(uint256 => Chat) chats;

    

}