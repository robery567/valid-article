pragma solidity ^0.6.5;

contract User {
    uint256 public score;
    address public userAddress;
    address public owner;

    constructor(address _userAddress) public {
        score = 0;
        userAddress = _userAddress;
        owner = msg.sender;
    }

    function setScore(uint256 _score) public {
        // As a security measure, we allow only the creator to alter the score
        require(msg.sender == owner);
        score = _score;
    }

    function getUserAddress() public view returns(address) {
        return userAddress;
    }
}