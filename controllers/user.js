const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const { getHistoricalStockData, getTodayStockData, getCompanyNews, fetchLatestNews } = require('./stockController');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Bad request. Please add email and password in the request body" });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      // console.log("Could not find user with email:", email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await foundUser.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign({ id: foundUser._id, name: foundUser.name }, process.env.JWT_SECRET, { expiresIn: "30d" });
    return res.status(200).json({ msg: "User logged in", token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const register = async (req, res) => {
  const { username, email, password } = req.body;
  // console.log(req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please provide all values in the request body" });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name: username, email, password: hashedPassword, wallet: 10000.00 }); // Initialize wallet with $10000
    await newUser.save();
    return res.status(201).json({ person: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};


const dashboard = async (req, res) => {
  try {
    const luckyNumber = Math.floor(Math.random() * 100);
    res.status(200).json({ msg: `Hello, ${req.user.name}`, luckyNumber });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const getLatestNews = async (req, res) => {
  try {
    const latestNews = await fetchLatestNews();
    res.status(200).json({ latestNews });
  } catch (error) {
    console.error("Error fetching latest news:", error);
    return res.status(500).json({ msg: "Error fetching latest news" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const getStockData = async (req, res) => {
  const { stockTicker, date } = req.body;

  if (!stockTicker) {
    return res.status(400).json({ msg: "Please provide a valid stock ticker symbol in the request body" });
  }

  try {
    const historicalData = await getHistoricalStockData(stockTicker, date);
    return res.status(200).json({ stockData: historicalData });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return res.status(500).json({ msg: "Failed to fetch stock data. Please try again later." });
  }
};

const getLatestStockData = async (req, res) => {
  const { stockTicker } = req.body;

  if (!stockTicker) {
    return res.status(400).json({ msg: "Please provide a valid stock ticker symbol in the request body" });
  }

  try {
    const todayData = await getTodayStockData(stockTicker);
    return res.status(200).json({ stockData: todayData });
  } catch (error) {
    console.error("Error fetching today's stock data:", error);
    return res.status(500).json({ msg: "Failed to fetch today's stock data. Please try again later." });
  }
};

const updateUserPortfolio = async (req, res) => {
  const userId = req.user.id;
  const { portfolio } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { portfolio }, { new: true });
    res.status(200).json({ portfolio: user.portfolio });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return res.status(500).json({ msg: "Failed to update portfolio. Please try again later." });
  }
};

const getUserPortfolio = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    res.status(200).json({ portfolio: user.portfolio, wallet: user.wallet });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return res.status(500).json({ msg: "Failed to fetch portfolio. Please try again later." });
  }
};

const updatePortfolioAndWallet = async (req, res) => {
  const { portfolio, wallet } = req.body;
  try {
    // console.log("Update portfolio:", portfolio, wallet);
    const user = await User.findById(req.user.id);
    user.portfolio = portfolio;
    user.wallet = wallet;
    await user.save();
    res.status(200).json({ msg: 'Portfolio and wallet updated successfully' });
  } catch (error) {
    console.error("Error updating portfolio and wallet:", error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

const resetWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wallet = req.body.wallet;
    console.log(req.body.wallet);

    await user.save();
    res.status(200).json({ msg: 'Wallet reset successfully' });
  } catch (error) {
    console.error("Error resetting wallet:", error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

const resetAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wallet = req.body.wallet;
    user.portfolio = req.body.portfolio;
    user.transactionHistory = [];

    await user.save();
    res.status(200).json({ msg: 'Account reset successfully' });
  } catch (error) {
    console.error("Error resetting account:", error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Using deleteOne method from the User model
    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // console.log("success delete");
    res.status(200).json({ msg: 'Account deleted successfully' });

  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ msg: 'Server error' });
  }
};


const saveTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const transaction = req.body.transaction;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.transactionHistory.push(transaction);
    await user.save();

    res.status(200).json({ msg: 'Transaction saved successfully' });
  } catch (error) {
    console.error("Error saving transaction:", error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ transactionHistory: user.transactionHistory });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

const getMockAPIData = async (req, res) => {
  // console.log('Mock API data fetched successfully');
  return res.status(200).json({ msg: 'Mock API data fetched successfully' });
};

module.exports = {
  login,
  register,
  dashboard,
  getAllUsers,
  getStockData,
  getLatestStockData,
  getLatestNews,
  updateUserPortfolio,
  getUserPortfolio,
  updatePortfolioAndWallet,
  resetWallet,
  resetAccount,
  deleteUser,
  saveTransaction,
  getTransactionHistory,
  getMockAPIData

};
