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
        this.connection.eth.defaultAccount = process.env.WALLET_PUBLIC_KEY;
    }

    async callContract(contractName, contractArgs) {
        try {
            const json = require(__dirname + '/../../../../truffle/build/contracts/' + contractName + ".json");

            const contract = require("truffle-contract");
            const calledContract = contract(json);

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

                    const functionCall = await applicationContract
                        .methods
                        .createUser()
                        .encodeABI();

                    await this.connection.eth.getTransactionCount(this.connection.eth.defaultAccount, (err, txCount) => {
                        const txObject = {
                            nonce: this.connection.utils.toHex(txCount),
                            to: contract.address,
                            value: this.connection.utils.toHex(this.connection.utils.toWei('0', 'ether')),
                            gasLimit: this.connection.utils.toHex(2100000),
                            gasPrice: this.connection.utils.toHex(this.connection.utils.toWei('4', 'gwei')),
                            data: functionCall
                        }

                        // Sign the transaction
                        const tx = new EthereumTx(txObject);
                        tx.sign(Buffer.from(process.env.WALLET_PRIVATE_KEY, 'hex'));

                        const serializedTx = tx.serialize();
                        const raw = '0x' + serializedTx.toString('hex');

                        // Broadcast the transaction
                        const transaction = this.connection.eth.sendSignedTransaction(raw, (err, tx) => {
                            console.log(tx)
                        });
                    });
                }
            });
        } catch (exception) {
            console.log(exception);
        }
    }
}