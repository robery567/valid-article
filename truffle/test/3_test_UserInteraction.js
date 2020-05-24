const UserContract = artifacts.require("./User.sol");
const ArticleContract = artifacts.require("./Article.sol");
const UserInteractionContract = artifacts.require("./UserInteraction.sol");

contract('UserInteraction', (accounts) => {
    let UserInteractionContractInstance;
    const articleHash = '$2a$10$sSGnr22pzo6LOpMt2Lf2345pwwa2.gwq3TFgAaf2/TqO01svxwqfY';
    const owner = accounts[1];

    beforeEach(async () => {
        UserInteractionContractInstance = await UserInteractionContract.new({from: owner});
    });

    it("should register voter+profile correctly", async () => {
        const voter = accounts[3];

        try {
            const userProfileContractInstance = await UserContract.new(voter, {from: owner});

            const userProfileAddress = userProfileContractInstance.address;

            await UserInteractionContractInstance.registerVoter(voter, userProfileAddress, {from: owner});
        } catch (e) {
            assert.fail();
        }

    });

    it("should unregister registered voter+profile", async () => {
        const voter = accounts[3];
        const userProfileContractInstance = await UserContract.new(voter, {from: owner});
        const userProfileAddress = userProfileContractInstance.address;
        await UserInteractionContractInstance.registerVoter(voter, userProfileAddress, {from: owner});

        await UserInteractionContractInstance.unregisterVoter(voter, userProfileAddress, {from: owner});

    });

    it("should register article", async () => {
        const articleContractInstance = await ArticleContract.new(articleHash, {from: owner});

        await articleContractInstance.transferOwnership(UserInteractionContractInstance.address, {from: owner});

        await UserInteractionContractInstance.registerArticle(articleContractInstance.address, {from: owner});

    });

    it("should allow voting", async () => {
        const voter = accounts[3];
        const userProfileContractInstance = await UserContract.new(voter, {from: owner});
        await UserInteractionContractInstance.registerVoter(voter, userProfileContractInstance.address, {from: owner});

        const articleContractInstance = await ArticleContract.new(articleHash, {from: owner});
        await articleContractInstance.transferOwnership(UserInteractionContractInstance.address, {from: owner});
        await UserInteractionContractInstance.registerArticle(articleContractInstance.address, {from: owner});

        const vote = true;

        await UserInteractionContractInstance.voteArticle(articleContractInstance.address,
            voter,
            userProfileContractInstance.address,
            vote,
            {from: owner});

    });


});