const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("./db");
const {
  Connection,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
  Keypair,
} = require("@solana/web3.js");
const bs58 = require("bs58");
dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userModal = require("./modal/userModal");

app.use("/api/v1/auth", authRoutes); //DONE
app.use("/api/v1/wallets", walletRoutes); //DONE
app.use("/api/v1/transactions", transactionRoutes); //DONE
app.use("/api/v1/admin", adminRoutes);

//DONE
app.post("/api/v1/bot/tip", async (req, res) => {
  const SolBuddyPubKey = new PublicKey("5KPzM9GvyN67ycrsHLBhW9BaQzbvTG5Jn4S198a5VzNf");
  const fromPubKey = new PublicKey(req.body.key);
  const amount = parseFloat(req.body.amount);
  try {
    const user = await userModal.findOne({
      publicKey: req.body.key,
    });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const pvtKey = bs58.default.decode(user.privateKey);
    const senderKeypair = Keypair.fromSecretKey(pvtKey);

    const transferInstruction = SystemProgram.transfer({
      fromPubkey: fromPubKey,
      toPubkey: SolBuddyPubKey,
      lamports: amount * LAMPORTS_PER_SOL,
    });

    const { blockhash } = await connection.getLatestBlockhash();
    const transaction = new Transaction(blockhash).add(transferInstruction);

    const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);

    return res.json({ message: "Tip sent successfull", signature: signature });
  } catch (error) {
    return res.status(500).json({
      message: "Failed sending tip",
      error: error,
    });
  }
});

//DONE
app.get("/api/v1/check-server", (req, res) => {
  res.send("server started....");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
