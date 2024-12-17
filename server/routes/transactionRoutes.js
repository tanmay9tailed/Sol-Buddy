const {
  Transaction,
  SystemProgram,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const express = require("express");
const userModal = require("../modal/userModal");
const bs58 = require("bs58");
const { default: axios } = require("axios");
const router = express.Router();

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

router.get("/balance/:publicKey", async (req, res) => {
  const publicKey = new PublicKey(req.params.publicKey);
  try {
    const balance = await connection.getBalance(publicKey);
    return res.json({
      message: "Balance",
      balance
    })
  } catch (error) {
    return res.json({
      message: "Error in getting Balance",
      error
    })
  }

});

router.post("/send-sol/:publicKey", async (req, res) => {
  
  const toPubKey = new PublicKey(req.body.toPubKey);
  const fromPubKey = new PublicKey(req.params.publicKey);
  const amount = parseFloat(req.body.amount);

  try {
    const user = await userModal.findOne({
      publicKey: req.params.publicKey,
    });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    console.log(user);
    

    const pvtKey = bs58.default.decode(user.privateKey);
    const senderKeypair = Keypair.fromSecretKey(pvtKey);

    const transferInstruction = SystemProgram.transfer({
      fromPubkey: fromPubKey,
      toPubkey: toPubKey,
      lamports: amount * LAMPORTS_PER_SOL,
    });

    const { blockhash } = await connection.getLatestBlockhash();
    const transaction = new Transaction(blockhash).add(transferInstruction);

    const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);

    return res.json({ message: "Sol sent successfull", signature: signature });
  } catch (error) {
    return res.json({
      message: "Failed sending sol",
      error: error,
    });
  }
});

router.get("/getSignatures/:publicKey", async (req, res) => {
  const { publicKey } = req.params;
  if (!publicKey) {
    return res.status(400).json({ message: "Public Key is required" });
  }
  try {
    const response = await axios.post(
      "https://api.devnet.solana.com",
      {
        jsonrpc: "2.0",
        id: 1,
        method: "getSignaturesForAddress",
        params: [
          publicKey,
          {
            limit: 1000,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.status(200).json({
      message: "Transaction Signatures Retrieved",
      data: response.data.result,
    });
  } catch (error) {
    console.error("Error fetching transaction signatures:", error.message);
    res.status(500).json({
      message: "Failed to fetch transaction signatures",
      error: error.message || "An error occurred",
    });
  }
});

router.get("/getTransaction/:signature", async (req, res) => {
  const { signature } = req.params;
  if (!signature) {
    return res.status(400).json({ message: "Signature is required" });
  }
  try {
    const response = await axios.post(
      "https://api.devnet.solana.com",
      {
        jsonrpc: "2.0",
        id: 1,
        method: "getTransaction",
        params: [signature],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = response.data.result;
    if (!result) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    const { transaction, meta } = result;
    const { accountKeys } = transaction.message;
    const { preBalances, postBalances } = meta;
    const sender = accountKeys[0]; 
    const receiver = accountKeys[1];
    res.status(200).json({
      message: "Transaction details retrieved successfully",
      data: {
        from: sender,
        to: receiver,
        preBalances: preBalances,
        postBalances: postBalances,
      },
    });
  } catch (error) {
    console.error("Error fetching transaction details:", error.message);
    res.status(500).json({
      message: "Failed to fetch transaction details",
      error: error.message || "An unexpected error occurred",
    });
  }
});

module.exports = router;
