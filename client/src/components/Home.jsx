import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [publicKey, setPublicKey] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [expandedAction, setExpandedAction] = useState(null);
  const [network, setNetwork] = useState("mainnet");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBalance, setShowBalance] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [tipAmount, setTipAmount] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [signature, setSignature] = useState("");
  const [tipSignature, setTipSignature] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const signedInKey = localStorage.getItem("signedIn");
    setPublicKey(signedInKey || "No Public Key Found");
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicKey);
    alert("Public Key Copied!");
  };

  const toggleNetwork = () => {
    setNetwork(network === "mainnet" ? "devnet" : "mainnet");
  };

  const menuOptions = [
    { label: "Send SOL", value: "send", icon: "💸", description: "Transfer SOL to another wallet" },
    { label: "Check Balance", value: "balance", icon: "💰", description: "View your current SOL balance" },
    { label: "Show Private Key", value: "privateKey", icon: "🔑", description: "Reveal your wallet's private key" },
    {
      label: "Show All Transactions",
      value: "transaction",
      icon: "💴",
      description: "See all your transaction from the first",
    },
    {
      label: "Create New Wallet",
      value: "wallet",
      icon: "💼",
      description: "Your old wallet will be deleted and a new one will be generated",
    },
    {
      label: "Tip SolBuddy",
      value: "tip",
      icon: "💰",
      description: "Tipping us keep us motivated to build more projects like this",
    },
  ];

  const checkBalance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://sol-buddy.onrender.com/api/v1/transactions/balance/${publicKey}`);
      setShowBalance(response.data.balance);
      setError("");
    } catch (err) {
      setError("Failed to fetch balance");
      console.error("Error in getting balance", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSol = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`https://sol-buddy.onrender.com/api/v1/transactions/send-sol/${publicKey}`, {
        toPubKey: receiverAddress,
        amount: parseFloat(amount),
      });
      alert("Transaction successful!");
      setReceiverAddress("");
      setAmount("");
      setError("");

      const sig = response.data.signature;
      setSignature(sig);
    } catch (err) {
      setError("Transaction failed");
      console.error("Error sending SOL:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPrivateKey = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://sol-buddy.onrender.com/api/v1/wallets/privatekey/${publicKey}`);
      setPrivateKey(response.data.privateKey);
      setError("");
    } catch (err) {
      setError("Failed to fetch private key");
      console.error("Error showing private key:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://sol-buddy.onrender.com/api/v1/transactions/getSignatures/${publicKey}`);
      console.log(response);
      setTransactions(response.data.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWallet = async () => {
    if (window.confirm("Are you sure you want to create a new wallet? Your current wallet will be deleted.")) {
      try {
        setLoading(true);
        const response = await axios.post("https://sol-buddy.onrender.com/api/v1/wallets/create", { publicKey });
        localStorage.setItem("signedIn", response.data.publicKey);
        setPublicKey(response.data.publicKey);
        setError("");
        alert("New wallet created successfully!");
      } catch (err) {
        setError("Failed to create new wallet");
        console.error("Error creating wallet:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTip = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("https://sol-buddy.onrender.com/api/v1/bot/tip", {
        amount: parseFloat(tipAmount),
        key: publicKey,
      });
      alert("Thank you for your tip!");
      setTipSignature(response.data.signature);
      setTipAmount("");
      setError("");
    } catch (err) {
      setError("Tip failed");
      console.error("Error sending tip:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-[50%] translate-x-[-50%] left-[50%] translate-y-[-45%] flex flex-col md:flex-row h-[85vh] w-[90vw] bg-emerald-50 dark:bg-emerald-900 text-emerald-900 dark:text-lime-300 rounded-xl overflow-auto">
      {/* Mobile Menu Toggle Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-emerald-500 text-white rounded-lg"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? "✕" : "☰"}
      </button>

      {/* Left Menu */}
      <div
        className={`${
          showMobileMenu ? "fixed inset-0 z-40" : "hidden"
        } md:relative md:block w-full md:w-1/4 p-4 bg-emerald-100 dark:bg-emerald-800 shadow-md rounded-t-xl md:rounded-l-xl md:rounded-tr-none`}
      >
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-500 to-lime-500 text-transparent bg-clip-text">
          SolBuddy
        </h2>
        <ul className="space-y-4">
          {menuOptions.map((option) => (
            <li
              key={option.value}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedOption === option.value
                  ? "bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-lg"
                  : "bg-emerald-50 dark:bg-emerald-700 hover:shadow-md"
              }`}
              onClick={() => {
                setSelectedOption(option.value);
                setShowMobileMenu(false);
                if (option.value === "transaction") {
                  handleShowTransactions();
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div className="flex flex-col">
                  <span className="font-semibold">{option.label}</span>
                  <span className="text-sm opacity-75">{option.description}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 p-6 flex flex-col space-y-6">
        {/* Public Key Section */}
        <div className="p-4 bg-gradient-to-r from-emerald-100 to-lime-100 dark:from-emerald-800 dark:to-emerald-700 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-center backdrop-blur-sm gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Your Public Key</h3>
            <p className="break-all font-mono text-sm md:text-base">{publicKey}</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <button
              onClick={handleCopy}
              className="w-full md:w-auto py-2 px-4 bg-gradient-to-r from-emerald-400 to-lime-400 text-white dark:text-emerald-900 font-medium rounded-lg hover:from-emerald-500 hover:to-lime-500 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Copy
            </button>
            <button
              onClick={toggleNetwork}
              className={`w-full md:w-auto py-2 px-4 font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
                network === "mainnet"
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {network === "mainnet" ? "Switch to Devnet" : "Switch to Mainnet"}
            </button>
          </div>
        </div>

        {/* Interactive Dashboard Section */}
        <div className="flex flex-col md:flex-row flex-1 rounded-lg overflow-hidden border-2 border-emerald-200 dark:border-emerald-700">
          {/* Interactive Console */}
          <div className="w-full md:w-1/3 p-6 bg-gradient-to-b from-emerald-200 to-emerald-100 dark:from-emerald-800 dark:to-emerald-700 text-emerald-900 dark:text-lime-300">
            <h3 className="text-xl font-bold mb-4 text-center">Quick Actions</h3>
            <div className="space-y-3">
              {menuOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setExpandedAction(expandedAction === option.value ? null : option.value);
                    setSelectedOption(option.value);
                    if (option.value === "transaction") {
                      handleShowTransactions();
                    }
                  }}
                  className="flex flex-col p-2 rounded-md hover:bg-emerald-300/20 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{option.icon}</span>
                      <span className="font-mono text-sm">{option.label}</span>
                    </div>
                    <span
                      className={`transform transition-transform duration-200 ${
                        expandedAction === option.value ? "rotate-90" : ""
                      }`}
                    >
                      ➤
                    </span>
                  </div>
                  {expandedAction === option.value && (
                    <div className="mt-2 ml-8 text-sm opacity-75">{option.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-full md:w-2/3 p-6 bg-gradient-to-br from-emerald-50 to-lime-50 dark:from-emerald-700 dark:to-emerald-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Details</h3>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/30 dark:bg-black/20">
                Network: {network === "mainnet" ? "Mainnet" : "Devnet"}
              </span>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
                {error}
              </div>
            )}
            {loading && (
              <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md">
                Loading...
              </div>
            )}
            {selectedOption ? (
              <>
                <div className="p-4 bg-white/30 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                  <p className="font-medium">
                    Selected Action: <span className="font-bold capitalize">{selectedOption}</span>
                  </p>
                </div>
                {selectedOption === "send" ? (
                  <>
                    <div className="mt-4 p-4 bg-white/30 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                      <form className="space-y-4" onSubmit={handleSendSol}>
                        <div>
                          <label htmlFor="receiver" className="block text-sm font-medium mb-1">
                            Receiver Address
                          </label>
                          <input
                            type="text"
                            id="receiver"
                            value={receiverAddress}
                            onChange={(e) => setReceiverAddress(e.target.value)}
                            placeholder="Enter receiver's address"
                            className="w-full px-4 py-2 bg-lime-100 dark:bg-emerald-800 border border-emerald-300 dark:border-lime-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-lime-500 text-emerald-900 dark:text-lime-300"
                          />
                        </div>
                        <div>
                          <label htmlFor="amount" className="block text-sm font-medium mb-1">
                            Amount
                          </label>
                          <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount to send"
                            className="w-full px-4 py-2 bg-lime-100 dark:bg-emerald-800 border border-emerald-300 dark:border-lime-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-lime-500 text-emerald-900 dark:text-lime-300"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-md transition-colors duration-200"
                        >
                          Send Transaction
                        </button>
                      </form>
                    </div>
                    {signature === "" ? (
                      ""
                    ) : (
                      <div className="mt-4 p-3 bg-white/50 dark:bg-black/30 rounded-md">
                        <p className="text-sm font-medium mb-1">Your Signature:</p>
                        <a
                          href={`/signature/${signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline cursor-pointer break-all"
                        >
                          {signature}
                        </a>
                      </div>
                    )}
                  </>
                ) : selectedOption === "balance" ? (
                  <>
                    <div className="mt-4 p-4 bg-white/30 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                      <button
                        onClick={checkBalance}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-md transition-colors duration-200"
                      >
                        Check Balance
                      </button>
                    </div>
                    {showBalance !== "" && (
                      <div className="mt-4 p-4 bg-white/30 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                        <span className="font-medium">Your Balance: </span>
                        <span className="font-bold">{showBalance / 1000000000} SOL</span>
                      </div>
                    )}
                  </>
                ) : selectedOption === "privateKey" ? (
                  <div className="mt-4 p-4 bg-white/30 dark:bg-black/20 rounded-lg backdrop-blur-sm space-y-4">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md">
                      ⚠️ Warning: Your private key is sensitive information. Never share it with anyone!
                    </div>
                    <button
                      onClick={handleShowPrivateKey}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                    >
                      Show Private Key
                    </button>
                    {privateKey && (
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                        <p className="font-mono break-all">{privateKey}</p>
                      </div>
                    )}
                  </div>
                ) : selectedOption === "transaction" ? (
                  <div className="mt-4 p-4 bg-white/30 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                    {transactions.length > 0 ? (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {transactions.map((tx, index) => (
                          <div key={index} className="p-3 bg-white/50 dark:bg-black/30 rounded-md">
                            <a
                              href={`/signature/${tx.signature}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline cursor-pointer break-all"
                            >
                              {tx.signature}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No transactions found</p>
                    )}
                  </div>
                ) : selectedOption === "tip" ? (
                  <div className="mt-4 p-4 bg-white/30 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                    <div>
                      <label htmlFor="tipAmount" className="block text-sm font-medium mb-1">
                        Tip Amount
                      </label>
                      <input
                        type="number"
                        id="tipAmount"
                        value={tipAmount}
                        onChange={(e) => setTipAmount(e.target.value)}
                        placeholder="Enter tip amount"
                        className="w-full px-4 py-2 bg-lime-100 dark:bg-emerald-800 border border-emerald-300 dark:border-lime-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-lime-500 text-emerald-900 dark:text-lime-300"
                      />
                    </div>
                    <button
                      onClick={handleTip}
                      disabled={loading}
                      className="w-full mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-md transition-colors duration-200"
                    >
                      Send Tip
                    </button>
                    {tipSignature && (
                      <div className="mt-4 p-3 bg-white/50 dark:bg-black/30 rounded-md">
                        <p className="text-sm font-medium mb-1">Transaction Signature:</p>
                        <a
                          href={`/signature/${tipSignature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline cursor-pointer break-all"
                        >
                          {tipSignature}
                        </a>
                      </div>
                    )}
                  </div>
                ) : selectedOption === "wallet" ? (
                  <div className="mt-4 p-4 bg-white/30 dark:bg-black/20 rounded-lg backdrop-blur-sm space-y-4">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md">
                      ⚠️ Warning: Creating a new wallet will permanently delete your current wallet. Make sure you have
                      backed up any important information.
                    </div>
                    <button
                      onClick={handleCreateWallet}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                    >
                      Create New Wallet
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex items-center justify-center h-[200px] bg-white/30 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                <p className="text-center text-emerald-600 dark:text-lime-300">
                  Select an action from the left menu to get started ✨
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
