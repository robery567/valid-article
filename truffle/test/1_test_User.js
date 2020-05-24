const UserContract = artifacts.require("./User.sol");

contract('User', (accounts) => {

    let UserContractInstance;
    let userAddress = accounts[3];
    let owner = accounts[1];
    let caller2 = accounts[2];

    beforeEach(async () => {
        UserContractInstance = await UserContract.new(userAddress, {from: owner});
    });

    it("should deploy correctly", async () => {
        const address = await UserContractInstance.userAddress.call();
        assert.equal(userAddress, address, "invalid user address in User after deploy");

        const reputation = await UserContractInstance.reputation.call();
        assert.equal(reputation, 1000, "invalid reputation in User after deploy");

    });

    it("should allow reputation changes by owner", async () => {
        const newReputation = 1200;

        await UserContractInstance.setReputation(newReputation, {from: owner});

        const actualReputation = await UserContractInstance.reputation.call();
        assert.equal(actualReputation, newReputation, "reputation not changed");
    });

    it("should allow adding used articles for reputation", async () => {
        const randomArticle = "0xc257274276a4e539741ca11b590b9447b26a8051";

        await UserContractInstance.setArticleAsUsed(randomArticle, {from: owner, gas: 500 * 1000});

        const articleUsed = await UserContractInstance.usedArticles.call(randomArticle);

        assert.equal(articleUsed, true, "the article was not marked as used for this user");
    });
});