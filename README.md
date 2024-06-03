# StockSim

StockSim is a full-stack stock simulation application that allows users to simulate buying and selling stocks, view current stock prices, get the latest news, and manage a virtual wallet. The project is built with a React frontend and an Express backend.

## Deployed Link
[stocksim-client.onrender.com](stocksim-client.onrender.com)

## Features

- **User Authentication**: Secure login and signup functionality.
- **Dashboard**: View portfolio, total investment, current value, and profit/loss.
- **Stock Management**: Buy and sell stocks, view transaction history.
- **Latest News**: Fetch and display the latest news related to stocks.
- **Virtual Wallet**: Manage virtual money, view wallet balance and profit/loss, reset wallet, and account.
- **Portfolio Summary**: Displays invested amount, current value, total profit/loss in both money and percentage.

## Tech Stack

- **Frontend**: React, React Router, React Toastify, Axios
- **Backend**: Node.js, Express, MongoDB
- **Styling**: CSS
- **API**: Finnhub, Yahoo Finance, Google Finance

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Kuzma02/stock-app.git
    cd stock-app
    ```

2. Install dependencies:
    ```sh
    npm install
    cd client
    npm install
    cd ..
    ```

3. Create a `.env` file in the root directory and add the following:
    ```env
    PORT=3000
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```

4. Start the application:
    ```sh
    npm run start
    ```

## Usage

1. **Login/Register**: Access the login or register page to authenticate yourself.
2. **Dashboard**: Once logged in, you will be redirected to the dashboard.
    - View your portfolio summary, including the invested amount, current value, and total profit/loss.
    - Use the form to add new stocks to your portfolio.
    - Fetch the latest stock news by clicking the "Latest News" button.
    - View your transaction history and manage your virtual wallet.
3. **Manage Stocks**:
    - Add stocks to your portfolio by specifying the stock symbol, purchase date, and quantity.
    - Sell stocks from your portfolio and view the updated profit/loss.
4. **Virtual Wallet**:
    - View your current wallet balance and profit/loss.
    - Reset your wallet or account using the respective buttons in the navbar.

## Project Structure

- **Frontend**: Located in the `client` directory.
  - Components: All React components.
  - Styles: CSS files for styling the components.
  - Helpers: Functions to handle API requests and data processing.
- **Backend**: Located in the root directory.
  - Routes: Express routes for handling API requests.
  - Controllers: Functions to handle the logic for each route.
  - Models: Mongoose models for MongoDB collections.

## Contributing

Feel free to contribute to the project by opening a pull request. For major changes, please open an issue first to discuss what you would like to change.


