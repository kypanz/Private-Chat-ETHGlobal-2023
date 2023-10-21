# Private-Chat-ETHGlobal-2023 | Hackthon

Private Messages on Blockchain using Asymmetric encryption + Symmetric encryption

## Diagram flow

![PrivateChat-ETHGlobal-Hackthon-2023 drawio](https://github.com/kypanz/Private-Chat-ETHGlobal-2023/assets/37570367/cdbc9c87-d2d2-4939-855e-92b6e39966a3)


## Description

I make this project because i have curious about if is possible to have an private chat on blockchain, and can be possible using Asymmetric encryption + Symmetric encryption, first you need to publish a public key generated by your own, with this public key an user can encrypt the message to start a comunication, in the message you define what secret key gonna be used from the two users to decrypt the messages, once the comunication is established an acepted, you can start sending messages to the another user using the same secret key, the asymmetric encryption is for the first contact to decrypt the message wihout exposed in the blockchain from a attacker and the symmetric encryption is used to comunicated all the messages

To be honestly i really wanna build the frontend but i not have much time because i spend a lot of time thinking how this can be possible, and i have luck because i solved, may be is not the best solution but works, and i am happy with that, because i did it :)

## Test cases

![image](https://github.com/kypanz/Private-Chat-ETHGlobal-2023/assets/37570367/369d0f84-22fd-4cb5-92da-1bd2b216c113)

## Installation 

Clone the repo with : 

```shell
git clone git@github.com:kypanz/Private-Chat-ETHGlobal-2023.git
```

Install packages with :

```shell
npm install
```

Run the test cases with :

```shell
npx hardhat test
```
