pragma solidity ^0.6.5;

contract Comment {
    address public userAddress;
    address public articleAddress;
    address public owner;
    string public commentHash;
    uint256 public score;

    constructor(address _userAddress, address _articleAddress, string memory _commentHash) public {
        userAddress = _userAddress;
        articleAddress = _articleAddress;
        commentHash = _commentHash;
        score = 0;
        owner = msg.sender;
    }

    function setScore(uint256 givenScore) public {
        // As a security measure, we allow only the creator to alter the score
        require(msg.sender == owner);
        score = givenScore;
    }

    function getScore() public view returns(uint256) {
        return score;
    }

    function getUserAddress() public view returns(address) {
        return userAddress;
    }
}
