pragma solidity ^0.6.5;

import "./User.sol";
import "./Comment.sol";

contract UserInteraction {
    mapping(address => User) public users;
    mapping(address => Comment) public comments;

    constructor() public {

    }

    function createUser() public {
        require(users[msg.sender].getUserAddress() == address(0));
        users[msg.sender] = new User(msg.sender);
    }

    function createComment(address _articleAddress, string memory _commentHash) public {
        require(users[msg.sender].getUserAddress() != address(0));
        Comment comment = new Comment(msg.sender, _articleAddress, _commentHash);

        comments[address(comment)] = comment;
    }

    function endorseComment(address _commentAddress) public {
        Comment comment = comments[_commentAddress];
        require(comment.getUserAddress() != address(0));
        require(users[msg.sender].getUserAddress() != address(0));

        comment.setScore(comment.getScore() + 1);
    }

    function dislikeComment(address _commentAddress) public {
        Comment comment = comments[_commentAddress];
        require(comment.getUserAddress() != address(0));
        require(users[msg.sender].getUserAddress() != address(0));

        comment.setScore(comment.getScore() - 1);
    }
}
