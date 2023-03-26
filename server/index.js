const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const BlockChain = require("./BlockChain");
const Block = require("./Block");
const { verify, recoverPublicKey } = require("ethereum-cryptography/secp256k1");
const { publicToAddress } = require('ethereumjs-util');
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const blockChain = new BlockChain();


function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

function verifySignedMessage({ message, signature }) {
  const hash = hashMessage(message);
  const bytes = Object.values(signature[0]);
  const bytesSignature = Buffer.from(bytes);
  const publicKey = recoverPublicKey(hash, bytesSignature, signature[1]);
  return verify(bytesSignature, hash, publicKey)
}

setInterval(() => {
  blockChain.createNewBlock();
}, 1000);

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = blockChain.getBalance(address);
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, message } = req.body;
  const { amount, sender, recipient } = JSON.parse(message);

  if (verifySignedMessage({message, signature})) {
    try {
      blockChain.createNewTransaction(amount, sender, recipient);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  } else {
    // Signature is invalid
    res.sendStatus(401);
  }



});

app.get("/chain", (req, res) => {
  res.send(blockChain.getChain());
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
