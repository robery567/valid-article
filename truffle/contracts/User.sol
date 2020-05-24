pragma solidity ^0.6.5;

import "./libs/Ownable.sol";

contract User is Ownable {

    address public userAddress;

    uint32 public reputation;

    mapping(address => bool) public usedArticles;

    constructor(address _userAddress) public{
        userAddress = _userAddress;
        reputation = 1000;
    }

    function setArticleAsUsed(address articleAddress) public onlyOwner {
        if (usedArticles[articleAddress]) {
            revert();
        }
        usedArticles[articleAddress] = true;
    }

    function setReputation(uint32 _reputation) public onlyOwner {
        reputation = _reputation;
    }
}
