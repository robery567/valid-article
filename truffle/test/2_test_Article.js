const ArticleContract = artifacts.require("./Article.sol");

contract('Article', (accounts) => {

    let articleContractInstance;
    const articleHash = '$2a$10$sSGnr22pzo6LOpMt2Lf2345pwwa2.gwq3TFgAaf2/TqO01svxwqfY';
    const owner = accounts[1];
    const voter = accounts[2];

    beforeEach(async () => {
        articleContractInstance = await ArticleContract.new(articleHash, {from: owner});
    });


    it("should deploy correctly", async () => {
        const hash = await articleContractInstance.hash.call();
        assert.equal(hash, articleHash, "invalid hash");

        const propNames = ['trueVotes', 'trueScore', 'fakeVotes', 'fakeScore'];
        for (let propName of propNames) {
            assert.equal(await articleContractInstance[propName].call(), 0, "invalid " + propName);
        }
    });

    it("should allow vote for a new article", async () => {

        let didVote = await articleContractInstance.didVote.call(voter);
        assert.equal(didVote, false);

        await articleContractInstance.doVote(true, voter, 1500, {from: owner});
        didVote = await articleContractInstance.didVote.call(voter);

        assert.equal(didVote, true);

    });

    it("should update scores and votes correctly after vote action", async () => {
        const voteWeight = 1400;
        const vote = true;
        const propNames = ['trueVotes', 'trueScore', 'fakeVotes', 'fakeScore'];
        const oldValues = [];
        for (let propName of propNames) {
            oldValues.push((await articleContractInstance[propName].call()).toNumber());
        }

        await articleContractInstance.doVote(vote, voter, voteWeight, {from: owner});

        const actualValues = [];

        for (let propName of propNames) {
            actualValues.push((await articleContractInstance[propName].call()).toNumber());
        }

        const newValues = JSON.parse(JSON.stringify(oldValues));

        if (vote) {
            newValues[0]++;
            newValues[1] += voteWeight;
        } else {
            newValues[2]++;
            newValues[3] += voteWeight;
        }

        for (let i = 0; i < oldValues.length; i++) {
            assert.equal(actualValues[i], newValues[i], propNames[i] + " not updated");
        }

    });

});