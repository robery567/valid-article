import Web3 from 'web3';

export default class Web3j {
    #connection: Web3;

    constructor() {
        this.#connection = new Web3(`ws://${process.env.BLOCKCHAIN_SERVER}`);
    }
}