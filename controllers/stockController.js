
require("dotenv").config();
var util = require('util');


// const yahooFinance = require('yahoo-finance');
const axios = require('axios');
const googleFinance = require('google-finance');
const finnhub = require('finnhub');
const yahooFinance = require('yahoo-finance2').default; // NOTE the .default




// Function to fetch historical stock data
const getHistoricalStockData = async (stockTicker, startDate) => {
  // const query1 = stockTicker; // The query term for which you want to retrieve news
  // const queryOptions1 = {
  //   lang: 'en-US', // Language for the news articles (optional)
  //   region: 'US', // Region for the news articles (optional)
  //   quotesCount: 6, // Max number of quotes to return (optional)
  //   newsCount: 4 // Max number of news items to return
  // };


  // const newsall = await yahooFinance.search(query1, queryOptions1);

  // // Extract news articles from the result
  // const newsArticles = newsall.news;

  // // Output the news articles
  // console.log(newsArticles);

  // Trending Symbols
  // const queryOptions2 = { count: 5, lang: 'en-UK' };

  // const resulttredingSymbols = await yahooFinance.trendingSymbols('UK', queryOptions2);
  // console.log(`Trending symbols: ${resulttredingSymbols.quotes.map(quote => quote.symbol).join(', ')}`);

  // console.log(response.data.result);
  const query = stockTicker;
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 1); // Add one day to startDate to get endDate

  // console.log(query, start, end);

  const queryOptions = {
    period1: start.toISOString().split('T')[0], // Convert date to ISO string format
    period2: end.toISOString().split('T')[0], // Convert date to ISO string format
  };

  const result = await yahooFinance.historical(query, queryOptions);
  return result;


};

const getTodayStockData = async (stockTicker) => {
  const query = stockTicker;
  const result = await yahooFinance.quote(query, { fields: ['regularMarketPrice', 'displayName', 'firstTradeDateMilliseconds'] });
  // console.log(result);
  return result
};

const apiToken = process.env.MARKETAUX; // Replace 'YOUR_API_TOKEN' with your actual API token

// Function to fetch company news for a stock
const getCompanyNews = async (symbols) => {

  try {

    const response = await axios.get('https://api.marketaux.com/v1/news/all', {
      params: {
        symbols: symbols,
        filter_entities: true,
        language: 'en', // Assuming you want news in English
        api_token: apiToken,
        // countries: 'in' // Specify India as the country
      }
    });

    return response.data;
  } catch (error) {
    console.log(error);
    // throw new Error("Failed to fetch company news");
  }
};


const fetchLatestNews = async () => {
  try {
    const response = await axios.get(`https://api.marketaux.com/v1/news/all?countries=in&filter_entities=true&published_after=2024-04-08T00:23&api_token=${apiToken}`);
    return response.data;
  }

  catch (error) {
    console.log(error);
    // throw new Error("Failed to fetch company news");
  }

}

module.exports = { getHistoricalStockData, getTodayStockData, getCompanyNews, fetchLatestNews };
