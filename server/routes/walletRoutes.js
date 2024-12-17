const express = require("express");
const userModal = require("../modal/userModal");
const { Keypair } = require("@solana/web3.js");
const bs58 = require("bs58");
const router = express.Router();

router.post("/create", async (req, res) => {
  const { publicKey } = req.body;
  if (!publicKey) {
    return res.status(400).json({ message: "Public Key is required" });
  }
  try {
    const user = await userModal.findOne({ publicKey });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const keyPair = new Keypair();
    const pubKey = keyPair.publicKey.toBase58(); 
    const pvtKey = bs58.default.encode(keyPair.secretKey); 
    await userModal.findOneAndUpdate(
      { _id: user._id },
      { publicKey: pubKey, privateKey: pvtKey },
      { new: true } 
    );
    res.status(200).json({
      message: "New Wallet Created",
      publicKey: pubKey,
    });
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).json({
      message: "Creating Wallet Failed",
      error: error.message || error.toString(),
    });
  }
});

router.get("/privatekey/:publicKey",async (req, res) => {
  const { publicKey } = req.params;
  if (!publicKey) {
    return res.status(400).json({ message: "Public Key is required" });
  }
  try {
    const user = await userModal.findOne({ publicKey });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Get private key", privateKey:user.privateKey });
  } catch (error) {
    res.status(500).json({
      message: "Error getting private key:",
      error: error.message || error.toString(),
    });
  }
});

module.exports = router;
