// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StockSchema = new mongoose.Schema({
    stockTicker: String,
    purchaseDate: Date,
    quantity: Number,
    purchasePrice: Number,
    currentPrice: Number,
    profit: Number,
    profitPercentage: Number
}, { _id: false });

const TransactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['Buy', 'Sell'],
        required: true
    },
    stockTicker: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, { _id: false });

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        minlength: 3,
        maxlength: 50,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 3
    },
    portfolio: [StockSchema],
    wallet: {
        type: Number,
        default: 10000.00, // Initial wallet balance
    },
    transactionHistory: [TransactionSchema]
}, { versionKey: false });

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
