import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StockSimLogo from "../assets/StockSim.png";
import "../styles/Navbar.css";
import walletLogo from "../assets/wallet.png";
import { toast } from 'react-toastify';



// Define a function to format the date as DD-MM-YYYY
const formatDate = (date) => {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear();
    return `${day}-${month}-${year}`;
};

// Define a function to format the time as HH:MM AM/PM
const formatTime = (date) => {
    const formattedTime = new Date(date);
    let hours = formattedTime.getHours();
    const minutes = formattedTime.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    return `${hours}:${minutes}${ampm}`;
};


const Navbar = ({ token, handleDeleteAccount, walletBalance, walletPnl, handleResetWallet, handleResetAcc, fetchTransactionHistory, setWallet, setPortfolio, navigate, setToken, transactionDropdownVisible, setTransactionDropdownVisible, transactionHistory, setTransactionHistory }) => {
    const [walletDropdownVisible, setWalletDropdownVisible] = useState(false);


    const toggleWalletDropdown = () => {
        setWalletDropdownVisible(!walletDropdownVisible);
    };

    const toggleTransactionDropdown = async () => {
        setTransactionDropdownVisible(!transactionDropdownVisible);
        if (!transactionDropdownVisible) {
            try {
                const history = await fetchTransactionHistory(token);
                setTransactionHistory(history || []);
            } catch (error) {
                toast.error("Failed to fetch transaction history. Please try again later.");
            }
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-items">
                <img src={StockSimLogo} alt="StockSim Logo" className="navbar-logo" />
                <Link to="/" className="navbar-item">Home</Link>
                <Link to="/logout" className="navbar-item">Logout</Link>
                <button onClick={() => {
                    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                        handleDeleteAccount(token, setToken, navigate);
                    }
                }} className="delete-account-button">Delete Account</button>

                <div className="wallet-container" onClick={toggleWalletDropdown}>
                    <p>
                        Wallet
                        <img src={walletLogo} alt="Wallet Logo" className="wallet-logo" />
                    </p>
                    {walletDropdownVisible && (
                        <div className="wallet-dropdown">
                            <p>Wallet Balance: ${walletBalance.toFixed(2)}</p>
                            <p>P&L: {walletPnl}</p>
                            <button onClick={() => handleResetWallet(token, setWallet)}>Reset Wallet</button>
                            <button onClick={() => handleResetAcc(token, setWallet, setPortfolio, setTransactionHistory)}>Reset Account</button>
                        </div>
                    )}
                </div>

                <div className="wallet-container" onClick={toggleTransactionDropdown}>
                    <p>Transactions ▼</p>
                    {transactionDropdownVisible && (
                        <div className="wallet-dropdown">
                            <div className="transaction-history scrollable-container">
                                {transactionHistory.length === 0 ? (
                                    <p>No transactions available</p>
                                ) : (
                                    <>
                                        {transactionHistory.map((transaction, index) => (
                                            <div key={index} className="transaction-item">
                                                <div className="transaction-date-time grey" >
                                                    <span className="transaction-date">{formatDate(transaction.date)}</span>
                                                    <span className="transaction-time align-right">{formatTime(transaction.date)}</span>
                                                </div>
                                                <div className="transaction-order-qty">
                                                    <span className="transaction-order"><strong>Order:</strong> {transaction.type}</span>
                                                    <span className="transaction-quantity align-right"><strong>Qty.:</strong> {transaction.quantity}</span>
                                                </div>
                                                <div className="transaction-stock-amount">
                                                    <span className="transaction-stock"><strong>{transaction.stockTicker}</strong></span>
                                                    <span className="transaction-amount align-right">${transaction.amount.toFixed(2)}</span>
                                                </div>
                                                <div className='transaction-stock-amount'>
                                                    <span className='transaction-perstock '>({(transaction.amount / transaction.quantity).toFixed(2)})</span>

                                                </div>
                                                <hr className="transaction-separator" />
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
