// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PrivateChat {

    // con = connection
    string constant con_encryptionType = 'RSA';
    string constant con_modulusLength = '2048';
    string constant con_pubKeyType = 'spki';
    string constant con_format = 'pem';

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

    function createChat(address _toUser, string memory _secretKeyEncrypted) public {

        User storage userA = users[msg.sender];
        User storage userB = users[_toUser];
        string[] memory messages;

        chats[chatId] = Chat({
            userA : userA,
            userB : userB,
            isAccepted : false,
            messages : messages
        });

        chats[chatId].messages.push(_secretKeyEncrypted);

    }

    function acceptChat(uint256 _id) public {
        // TODO : Requires checks
        chats[_id].isAccepted = true;
    }

    function sendMessage(uint256 _toChat, string memory _message) public {
        // TODO : Requires checks
        chats[_toChat].messages.push(_message);
        emit MessageSended(_toChat, msg.sender, _message);
    }

    function getMessages(uint256 _id) public view returns(string[] memory _messages) {
        return chats[_id].messages;
    }

}