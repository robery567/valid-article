import Web3 from 'web3';
import {UserInteraction} from "../../../contracts/UserInteraction";
import {User} from "../../../contracts/User";
import {Comment} from "../../../contracts/Comment";
import * as fs from "fs";
import {AbiItem} from 'web3-utils'
import {Transaction as EthereumTx} from "ethereumjs-tx"


export default class Web3jService {
    private connection: Web3;

    constructor() {
        this.connection = new Web3(process.env.BLOCKCHAIN_SERVER);
    }

    async send(transaction) {
        const gas = await transaction.estimateGas({from: process.env.WALLET_PUBLIC_KEY});
        const options = {
            to: transaction._parent._address,
            data: transaction.encodeABI(),
            gas: gas
        };

        const signedTransaction = await this.connection.eth.accounts.signTransaction(options, '0x' + process.env.WALLET_PRIVATE_KEY);

        return this.connection.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    }

    async deploy(contractName, contractArgs) {
        try {
            const abi = fs.readFileSync(__dirname + '/../../../solidity/' + contractName + ".abi").toString();
            const bin = fs.readFileSync(__dirname + '/../../../solidity/' + contractName + ".bin").toString();
            const contract = new this.connection.eth.Contract(JSON.parse(abi));
            const deployedContract = contract.deploy({data: "0x" + bin, arguments: contractArgs});
            const handle = await this.send(deployedContract);
            // @ts-ignore
            console.log(`${contractName} contract deployed at address ${handle.contractAddress}`);

            return handle;
        } catch (exception) {
            console.log(exception);
        }

        return null;
    }

    async callContract(contractName, contractArgs) {
        try {
            // Step 1: Get a contract into my application
            const json = require(__dirname + '/../../../../truffle/build/contracts/' + contractName + ".json");

            // Step 2: Turn that contract into an abstraction I can use
            const contract = require("truffle-contract");
            const calledContract = contract(json);

            // Step 3: Provision the contract with a web3 provider
            const HDWalletProvider = require("@truffle/hdwallet-provider");
            calledContract.setProvider(
                new HDWalletProvider(
                    process.env.WALLET_PRIVATE_KEY,
                    process.env.BLOCKCHAIN_SERVER
                )
            );

            calledContract.new(
                {
                    from: process.env.WALLET_PUBLIC_KEY,
                    data: '0x',
                    gas: '4700000',
                }
            ).then(async (contract) => {
                if (typeof contract.address !== 'undefined') {
                    const applicationContract = new this.connection.eth.Contract(
                        calledContract.abi,
                        contract.address
                    );

                    await applicationContract
                        .methods
                        .createUser()
                        .call({from: process.env.WALLET_PUBLIC_KEY})
                        .then(data => console.log(data))
                        .catch(err => console.log(err));
                }
            });

        } catch (exception) {
            console.log(exception);
        }
    }
}