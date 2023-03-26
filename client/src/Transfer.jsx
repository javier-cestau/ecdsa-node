import { useState } from "react";
import server from "./server";
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { signSync, utils } = require("ethereum-cryptography/secp256k1");
const randPK = utils.randomPrivateKey();

function generateSignedMessage(message) {
  const hashMessage = keccak256(utf8ToBytes(message));
  const signature = signSync(hashMessage, randPK, { recovered: true });
  return signature
}

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const message = JSON.stringify({
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
    })

    const signature = generateSignedMessage(message)

    try {
      const {
        data: { balance },
      } = await server.post(`send`, { signature, message } );
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
