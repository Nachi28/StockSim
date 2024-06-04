import axios from 'axios';
import { toast } from 'react-toastify';
const initialWalletBalance = 10000;

export const handleRegisterSubmit = async (name, lastname, email, password, confirmPassword, navigate) => {
  if (name.length > 0 && lastname.length > 0 && email.length > 0 && password.length > 0 && confirmPassword.length > 0) {
    if (password === confirmPassword) {
      const formData = { username: name + " " + lastname, email, password };
      try {
        // Register the user
        await axios.post("http://localhost:3000/api/v1/register", formData);
        toast.success("Registration successful");

        // Log in the user
        const loginResponse = await axios.post("https://stocksim-4yuz.onrender.com/api/v1/login", { email, password });
        localStorage.setItem('auth', JSON.stringify(loginResponse.data.token));
        toast.success("Login successful");
        navigate("/dashboard");
      } catch (err) {
        if (err.response && err.response.data && err.response.data.msg) {
          toast.error(err.response.data.msg);
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      }
    } else {
      toast.error("Passwords don't match");
    }
  } else {
    toast.error("Please fill all inputs");
  }
};

export const handleLoginSubmit = async (email, password, navigate) => {
  if (email.length > 0 && password.length > 0) {
    const formData = {
      email,
      password,
    };
    try {
      const response = await axios.post(
        "https://stocksim-4yuz.onrender.com/api/v1/login",
        formData
      );
      localStorage.setItem('auth', JSON.stringify(response.data.token));
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      if (err.response.data.msg === "Invalid password") {
        toast.error("Incorrect password");
      }
      if (err.response.data.msg === "Invalid credentials") {
        toast.error("Invalid email");
      }
    }
  } else {
    toast.error("Please fill all inputs");
  }
};

export const isValidStockTicker = (ticker, date) => {
  const tickerRegex = /^[A-Z0-9.:]+$/i;
  const isValidTicker = tickerRegex.test(ticker);
  const isValidDate = new Date(date) < new Date();
  return isValidTicker && isValidDate;
};



export const handleAddStock = async (e, portfolio, setPortfolio, setIsCalculatingPriceAndProfit, wallet, setWallet, token, saveTransaction, setTransactionHistory, transactionHistory) => {
  e.preventDefault();
  const stockTicker = e.target.stock.value.trim();
  const purchaseDate = e.target.date.value;
  const quantity = parseFloat(e.target.quantity.value);

  if (isValidStockTicker(stockTicker, purchaseDate)) {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/stockData", { stockTicker, date: purchaseDate });
      const stockData = response.data.stockData;

      if (stockData.length > 0) {
        const purchasePriceData = stockData[0];
        const purchasePrice = purchasePriceData.adjClose;
        const totalCost = purchasePrice * quantity;

        if (totalCost > wallet) {
          toast.error("Insufficient funds in wallet to buy this stock");
          return;
        }

        const newStock = { stockTicker, purchaseDate, quantity, purchasePrice };

        setPortfolio([...portfolio, newStock]);
        setWallet(wallet - totalCost);
        setIsCalculatingPriceAndProfit(true);
        await calculateCurrentPriceAndProfit([...portfolio, newStock], setPortfolio);
        setIsCalculatingPriceAndProfit(false);


        toast.success("Stock added successfully");

        // Save transaction history
        const transaction = { type: "Buy", stockTicker, quantity, amount: totalCost };
        await saveTransaction(token, transaction, setTransactionHistory, transactionHistory);
      } else {
        toast.error("No data found for the given date");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "An error occurred. Please try again later.");
    }
  } else {
    toast.error("Please enter a valid stock ticker and date");
  }
};

export const handleSellStock = async (stockToSell, portfolio, setPortfolio, wallet, setWallet, token, saveTransaction, setTransactionHistory, transactionHistory) => {
  const saleAmount = stockToSell.currentPrice * stockToSell.quantity;

  // Remove the sold stock from the portfolio
  const updatedPortfolio = portfolio.filter(stock => stock !== stockToSell);

  // Update the wallet balance
  const updatedWallet = wallet + saleAmount;

  setPortfolio(updatedPortfolio);
  setWallet(updatedWallet);

  try {
    // Save the updated portfolio and wallet
    await savePortfolioAndWallet(token, updatedPortfolio, updatedWallet);

    toast.success(`Sold ${stockToSell.stockTicker} for $${saleAmount.toFixed(2)}`);

    // Save transaction history
    const transaction = { type: "Sell", stockTicker: stockToSell.stockTicker, quantity: stockToSell.quantity, amount: saleAmount };
    await saveTransaction(token, transaction, setTransactionHistory, transactionHistory);
  } catch (error) {
    toast.error("Failed to update portfolio. Please try again later.");
  }
};




export const calculateCurrentPriceAndProfit = async (portfolio, setPortfolio) => {
  const updatedPortfolio = await Promise.all(
    portfolio.map(async (stock) => {
      try {
        const response = await axios.post("http://localhost:3000/api/v1/todayStockData", {
          stockTicker: stock.stockTicker,
        });
        const currentPriceData = response.data.stockData;
        // console.log("currentpricedata", currentPriceData);
        if (currentPriceData) {
          const currentPrice = currentPriceData.regularMarketPrice;
          const profit = (currentPrice - stock.purchasePrice) * stock.quantity;
          const profitPercentage = ((currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
          return { ...stock, currentPrice, profit, profitPercentage };
        }
        return { ...stock, currentPrice: 0, profit: 0, profitPercentage: 0 };
      } catch (error) {
        console.error("Error calculating current price and profit:", error);
        return { ...stock, currentPrice: 0, profit: 0, profitPercentage: 0 };
      }
    })
  );
  setPortfolio(updatedPortfolio);
};


export const getDashboardData = async (token, setData) => {
  let axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios.get("http://localhost:3000/api/v1/dashboard", axiosConfig);
    setData({ msg: response.data.msg, luckyNumber: response.data.secret });
  } catch (error) {
    toast.error(error.message);
  }
};


export const fetchPortfolio = async (token, setPortfolio, setWallet) => {
  let axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios.get("http://localhost:3000/api/v1/portfolio", axiosConfig);
    setPortfolio(response.data.portfolio);
    // console.log(response.data);
    setWallet(response.data.wallet);  // Fetch wallet balance from backend
  } catch (error) {
    toast.error("Failed to fetch portfolio. Please try again later.");
  }
};

export const savePortfolioAndWallet = async (token, updatedPortfolio, updatedWallet) => {
  let axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    await axios.post("http://localhost:3000/api/v1/portfolio", { portfolio: updatedPortfolio, wallet: updatedWallet }, axiosConfig);
    toast.success("Portfolio and wallet saved successfully!");
  } catch (error) {
    toast.error("Failed to save portfolio and wallet. Please try again later.");
  }
};

export const handleDeleteAccount = async (token, setToken, navigate) => {
  if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    return; // User canceled the action
  }

  let axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    await axios.delete("http://localhost:3000/api/v1/account", axiosConfig);


    // Clear token and navigate to landing page after successful deletion
    localStorage.removeItem("auth");
    setToken("");
    navigate("/");
    toast.success("Account deleted successfully!");
  } catch (error) {
    toast.error("Failed to delete account. Please try again later.");
  }
};



export const handleResetWallet = async (token, setWallet) => {

  let axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    await axios.post("http://localhost:3000/api/v1/reset-wallet", { wallet: initialWalletBalance }, axiosConfig);
    setWallet(initialWalletBalance); // Update the wallet state in the Dashboard component
    toast.success("Wallet reset successfully!");
  } catch (error) {
    toast.error("Failed to reset wallet. Please try again later.");
  }
};

export const handleResetAcc = async (token, setWallet, setPortfolio, setTransactionHistory) => {

  let axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    await axios.post("http://localhost:3000/api/v1/reset-account", { portfolio: [], wallet: initialWalletBalance }, axiosConfig);
    setWallet(initialWalletBalance); // Update the wallet state in the Dashboard component
    setPortfolio([]); // Update the portfolio
    setTransactionHistory([]); // Update the transaction history
    toast.success("Account reset successfully!");
  } catch (error) {
    toast.error("Failed to reset Account. Please try again later.");
  }



};


export const fetchTransactionHistory = async (token) => {
  let axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios.get("http://localhost:3000/api/v1/transaction-history", axiosConfig);
    return response.data.transactionHistory;
  } catch (error) {
    toast.error("Failed to fetch transaction history. Please try again later.");
  }
};
export const saveTransaction = async (token, transaction, setTransactionHistory, transactionHistory) => {
  let axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    await axios.post("http://localhost:3000/api/v1/save-transaction", { transaction }, axiosConfig);
    setTransactionHistory([...transactionHistory, transaction]);
    toast.success("Transaction saved successfully!");
  } catch (error) {
    toast.error("Failed to save transaction. Please try again later.");
  }
};






