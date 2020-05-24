pragma solidity ^0.6.5;

import "./libs/Ownable.sol";
import "./Article.sol";
import "./User.sol";

contract UserInteraction is Ownable {

    mapping(address => bool) public voters;
    mapping(address => bool) public voterProfiles;
    mapping(address => bool) public articles;

    constructor() public {
    }

    function registerVoter(address _voterAddress, address _voterProfileAddress) public onlyOwner {
        require(!voters[_voterAddress]);
        require(!voterProfiles[_voterProfileAddress]);
        require(User(_voterProfileAddress).userAddress() == _voterAddress);

        voters[_voterAddress] = true;
        voterProfiles[_voterProfileAddress] = true;
    }

    function unregisterVoter(address _voterAddress, address _voterProfileAddress) public onlyOwner {
        require(voters[_voterAddress]);
        require(voterProfiles[_voterProfileAddress]);
        require(User(_voterProfileAddress).userAddress() == _voterAddress);

        voters[_voterAddress] = false;
        voterProfiles[_voterProfileAddress] = false;
    }

    function registerArticle(address _articleAddress) public onlyOwner {
        require(Article(_articleAddress).owner() == address(this));

        articles[_articleAddress] = true;
    }

    function voteArticle(
        address _articleAddress,
        address _voterAddress,
        address _voterProfileAddress,
        bool _vote) public onlyOwner {

        require(voters[_voterAddress]);
        require(articles[_articleAddress]);
        require(User(_voterProfileAddress).userAddress() == _voterAddress);

        uint32 weight = User(_voterProfileAddress).reputation();

        Article(_articleAddress).doVote(_vote, _voterAddress, weight);
    }

}
