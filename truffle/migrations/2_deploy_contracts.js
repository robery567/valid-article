const UserInteraction = artifacts.require("UserInteraction");
const User = artifacts.require("User");
const Comment = artifacts.require("Comment");

module.exports = function(deployer) {
  deployer.deploy(UserInteraction);
  deployer.deploy(User);
  deployer.deploy(Comment);
};
