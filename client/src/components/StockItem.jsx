import React from 'react';
import "../styles/StockItem.css";

const StockItem = ({ stock, onSell, portfolio, setPortfolio, wallet, setWallet, token, saveTransaction, setTransactionHistory, transactionHistory }) => {
    const { stockTicker, purchaseDate, quantity, purchasePrice, currentPrice, profit } = stock;

    // Calculate total profit/loss
    const profitLoss = (currentPrice - purchasePrice) * quantity;
    const isProfit = profitLoss >= 0;

    // Calculate total invested amount
    const investedAmount = purchasePrice * quantity;

    // Calculate total profit percentage
    const totalProfitPercentage = ((profitLoss / investedAmount) * 100).toFixed(2);

    // Format total profit/loss string
    const formattedProfitLoss = isProfit ? `+${profitLoss.toFixed(2)}` : `-${Math.abs(profitLoss).toFixed(2)}`;

    // Apply color based on profit/loss
    const textColor = isProfit ? 'green' : 'red';

    // Format total profit percentage string with color
    const formattedProfitPercentage = isProfit ? `+${totalProfitPercentage}%` : `${totalProfitPercentage}%`;
    const percentageColor = isProfit ? 'green' : 'red';

    return (
        <div className="stock-item">
            <div className="stock-left">
                <p><span className="small-text">Qty.- {quantity} • {purchaseDate}</span></p>
                <p><b>{stockTicker}</b></p>
                <p>Invested: ${investedAmount.toFixed(2)} (${purchasePrice.toFixed(2)})</p>
            </div>
            <div className="stock-right">
                <p><span style={{ color: percentageColor }}>{formattedProfitPercentage}</span></p>
                <p>P&L: <span style={{ color: textColor }}> ${formattedProfitLoss}</span></p>
                <p>LTP: ${currentPrice || 0}</p>
            </div>
            <button onClick={() => onSell(stock, portfolio, setPortfolio, wallet, setWallet, token, saveTransaction, setTransactionHistory, transactionHistory)}>Sell</button>
        </div>
    );
};

export default StockItem;
