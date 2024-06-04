import React, { useEffect, useState } from 'react';
import "../styles/Dashboard.css";
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Newscard from './Newscard';
import { handleAddStock, calculateCurrentPriceAndProfit, getDashboardData, fetchPortfolio, savePortfolioAndWallet, handleDeleteAccount, handleResetWallet, handleResetAcc, saveTransaction, fetchTransactionHistory, handleSellStock } from '../helper/helper';
import StockItem from '../components/StockItem';

const Dashboard = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [data, setData] = useState({});
  const [news, setNews] = useState([]);
  const [newsVisible, setNewsVisible] = useState(false);
  const [newsFetched, setNewsFetched] = useState(false);
  const [latestNewsBtnText, setLatestNewsBtnText] = useState("Latest News");
  const [portfolio, setPortfolio] = useState([]);
  const [isCalculatingPriceAndProfit, setIsCalculatingPriceAndProfit] = useState(false);
  const [transactionDropdownVisible, setTransactionDropdownVisible] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);

  const initialWalletBalance = 10000;
  const [wallet, setWallet] = useState(null);

  const navigate = useNavigate();



  useEffect(() => {
    getDashboardData(token, setData);

    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    } else {
      fetchPortfolio(token, setPortfolio, setWallet);
    }
  }, [token]);

  useEffect(() => {
    if (portfolio.length && !isCalculatingPriceAndProfit) {
      setIsCalculatingPriceAndProfit(true);
      calculateCurrentPriceAndProfit(portfolio, setPortfolio);
    }
  }, [portfolio]);

  useEffect(() => {
    if (portfolio.length) {
      savePortfolioAndWallet(token, portfolio, wallet);
    }
  }, [portfolio, wallet]);

  const getLatestNews = async () => {
    if (!newsFetched) {
      let axiosConfig = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      try {
        const response = await axios.get("https://stocksim-4yuz.onrender.com/api/v1/latestNews", axiosConfig);
        setNews(response.data.latestNews.data);
        setNewsFetched(true);
        setNewsVisible(!newsVisible);
        setLatestNewsBtnText("Hide News");
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      setNewsVisible(!newsVisible);
      setLatestNewsBtnText(newsVisible ? "Latest News" : "Hide News");
    }
  };


  const totalInvestedAmount = portfolio.reduce((total, stock) => total + (stock.purchasePrice * stock.quantity), 0).toFixed(2);
  const totalCurrentValue = portfolio.reduce((total, stock) => total + (stock.currentPrice * stock.quantity), 0).toFixed(2);
  const totalProfitLoss = (totalCurrentValue - totalInvestedAmount).toFixed(2);
  const isProfit = totalProfitLoss >= 0;
  const formattedTotalProfitLoss = isProfit ? `+${totalProfitLoss}` : `${totalProfitLoss}`;
  const textColor = isProfit ? 'green' : 'red';
  const totalProfitLossPercentage = ((totalProfitLoss / totalInvestedAmount) * 100).toFixed(2);
  const formattedProfitPercentage = isProfit ? `+${totalProfitLossPercentage}%` : `${totalProfitLossPercentage}%`;

  function formatPnlForDisplay(currentWallet) {
    let pnl = currentWallet - initialWalletBalance;
    pnl = pnl.toFixed(2);

    const isPositive = pnl >= 0;
    const formattedPnl = parseFloat(pnl).toFixed(2);
    const color = isPositive ? 'green' : 'red';
    return (
      <span style={{ color }}>
        {isPositive ? `+${formattedPnl}` : `${formattedPnl}`}
      </span>
    );
  }

  return (
    <div className='dashboard-main'>
      <Navbar token={token} handleDeleteAccount={handleDeleteAccount} walletBalance={wallet} walletPnl={formatPnlForDisplay(wallet)} handleResetWallet={handleResetWallet} handleResetAcc={handleResetAcc} fetchTransactionHistory={fetchTransactionHistory} setWallet={setWallet} setPortfolio={setPortfolio} navigate={navigate} setToken={setToken} transactionDropdownVisible={transactionDropdownVisible} setTransactionDropdownVisible={setTransactionDropdownVisible} transactionHistory={transactionHistory} setTransactionHistory={setTransactionHistory} />
      <div className="dashboard-content">
        <div className="left-section">
          <h1>Dashboard</h1>
          <p>Hi {data.msg}! {data.luckyNumber}</p>
          <button onClick={getLatestNews} id='latestnews'>{latestNewsBtnText}</button>
          {newsVisible && <Newscard news={news} />}
          <div className="portfolio-summary">
            <div className="invested">
              <p>Invested</p>
              <p>${totalInvestedAmount}</p>
              <p>Total P&L</p>
            </div>
            <div className="current-value">
              <p>Current</p>
              <p style={{ color: textColor }}>${totalCurrentValue}</p>
              <p style={{ color: textColor }}>{formattedTotalProfitLoss} ({formattedProfitPercentage})</p>
            </div>
          </div>
        </div>
        <div className="right-section">
          <div className="form-container">
            <form onSubmit={(e) => handleAddStock(e, portfolio, setPortfolio, setIsCalculatingPriceAndProfit, wallet, setWallet, token, saveTransaction, setTransactionHistory, transactionHistory)}>
              <input type="text" placeholder="Stock Symbol" name="stock" required />
              <input type="date" placeholder="Purchase Date" name="date" required />
              <input type="number" placeholder="Quantity" name="quantity" required min="1" />
              <button type="submit">Buy Stock</button>
            </form>
          </div>
          <hr />
          {portfolio.map((stock, index) => (
            <StockItem key={index} stock={stock} onSell={handleSellStock} portfolio={portfolio} setPortfolio={setPortfolio} wallet={wallet} setWallet={setWallet} token={token} saveTransaction={saveTransaction} setTransactionHistory={setTransactionHistory} transactionHistory={transactionHistory} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
