
const Block = require("./Block");

class BlockChain {
    constructor() {
      this.chain = [
        new Block({
            index: 0,
            timestamp: Date.now(),
            transactions: [
                { sender: "0x0", recipient: '0x1', amount: 100, timestamp: Date.now() },
                { sender: "0x0", recipient: '0x2', amount: 50, timestamp: Date.now() },
                { sender: "0x0", recipient: '0x3', amount: 75, timestamp: Date.now() },
            ]
        })
      ];
      this.pendingTransactions = [];
    }

    createNewBlock() {
        if(this.pendingTransactions.length === 0) {
            console.log("No pending transactions!")
            return;
        }
        const newBlock = new Block({
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions
        });
        newBlock.setPreviousHash(this.getLastBlock().toHash());
        this.pendingTransactions = [];
        console.log("New block created!");
        this.chain.push(newBlock);
    }

    getLastBlock() {
      return this.chain[this.chain.length - 1];
    }

    createNewTransaction(amount, sender, recipient) {
      const newTransaction = { amount, sender, recipient, timestamp: Date.now()};
      if (!this.enoughFunds(newTransaction)) {
        throw new Error("Not enough funds!");
      }
      this.pendingTransactions.push(newTransaction);
    }

    enoughFunds(transaction) {
        const senderBalance = this.getBalance(transaction.sender);
        return transaction.amount <= senderBalance;
    }

    // It will get slower over time, but tutorial purposes...
    getBalance(address) {
        let balance = 0;
        for (let block of this.chain) {
            console.log(block)
            for (let transaction of block.transactions) {
                if (transaction.sender === address) {
                    balance -= transaction.amount;
                }
                if (transaction.recipient === address) {
                    balance += transaction.amount;
                }
            }
        }
        return balance;
    }

    getChain() {
        return this.chain.map(block => ({
            ...block,
            previousBlockHash: block.getPreviousHash().toString().slice(0, 10),
            hash: block.toHash().toString().slice(0, 10)
        }));
    }
  }

  module.exports = BlockChain;
