const express = require("express");
const router = express.Router();

const { login, register, dashboard, getAllUsers, getStockData, getLatestNews, getLatestStockData, updateUserPortfolio,
    getUserPortfolio, updatePortfolioAndWallet, resetWallet, resetAccount, deleteUser, saveTransaction,
    getTransactionHistory
} = require("../controllers/user");
const authMiddleware = require('../middleware/auth')

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/dashboard").get(authMiddleware, dashboard);
router.route("/stockData").post(getStockData);
// router.route("/users").get(getAllUsers);
router.route("/latestNews").get(getLatestNews);
router.route("/todayStockData").post(getLatestStockData);
router.route("/portfolio").get(authMiddleware, getUserPortfolio)
router.route("/portfolio").post(authMiddleware, updatePortfolioAndWallet);
router.route("/reset-wallet").post(authMiddleware, resetWallet);
router.route("/reset-account").post(authMiddleware, resetAccount);
router.delete('/account', authMiddleware, deleteUser);
router.post("/save-transaction", authMiddleware, saveTransaction);
router.get("/transaction-history", authMiddleware, getTransactionHistory);




module.exports = router;
