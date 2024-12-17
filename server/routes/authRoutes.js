const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userModal = require("../modal/userModal");
const { Keypair } = require("@solana/web3.js");
const bs58 = require("bs58");

router.post("/sign-in", async (req, res) => {
  const {usernameOrEmail, password } = req.body;

  try {
    
    const user = await userModal.findOne({ 
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      return res.status(200).send({ message: "User Signed In", publicKey:user.publicKey });
    } else {
      return res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error in sign-in process", error});
  }
});

router.post("/sign-up", async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const hashedPassword = (await bcrypt.hash(password, 10)).toString();
  try {
    const keyPair = new Keypair();
    const publicKey = keyPair.publicKey.toBase58();
    const privateKey = bs58.default.encode(keyPair.secretKey);
    await userModal.create({
      email,
      username,
      password: hashedPassword,
      publicKey,
      privateKey,
    });

    res.status(200).send({ message: "User Created", publicKey });
  } catch (error) {
    res.status(401).send({ message: "Error in creating user", error });
  }
});

module.exports = router;
