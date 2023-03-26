const SHA256 = require('crypto-js/sha256');

class Block {
    constructor({ index, timestamp, transactions }) {
        this.index =index
        this.timestamp = timestamp
        this.transactions = transactions
        this.nonce = 0
        this.previousBlockHash = '0'
    }

    toHash() {
        return SHA256(
            this.getData() +
            this.previousBlockHash
        )// a hash!
    }

    setPreviousHash(hash) {
        this.previousBlockHash = hash
    }

    getPreviousHash() {
        return this.previousBlockHash;
    }

    getData () {
        return this.index + this.timestamp + this.transactions + this.nonce + this.previousBlockHash
    }

}

module.exports = Block;
