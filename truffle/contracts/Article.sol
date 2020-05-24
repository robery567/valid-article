pragma solidity ^0.6.5;

import "./libs/math/SafeMath.sol";
import "./libs/Ownable.sol";


contract Article is Ownable {
    using SafeMath for uint256;

    uint256 public trueVotes;
    uint256 public trueScore;
    uint256 public fakeVotes;
    uint256 public fakeScore;

    string public hash;

    mapping(address => bool) public voteOf;
    mapping(address => uint32) public scoreOf;
    mapping(address => bool) public didVote;

    constructor(string memory _newsHash) public {
        hash = _newsHash;
    }

    function doVote(bool _vote, address voter, uint32 _weight) public onlyOwner {
        require (!didVote[voter]);

        if (_vote) {
            trueVotes = trueVotes.add(1);
            trueScore = trueScore.add(_weight);
        }
        else {
            fakeVotes = fakeVotes.add(1);
            fakeScore = fakeScore.add(_weight);
        }
        voteOf[voter] = _vote;
        didVote[voter] = true;
        scoreOf[voter] = _weight;
    }
}
