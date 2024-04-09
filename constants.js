require('dotenv').config({ path: '/home/mherr/GenerateArticle/Article-Generation/.env' });
// require('dotenv').config({});

// Define constants for all files to use
const WORDPRESS_POST_API_URL = process.env.WORDPRESS_POST_API_URL;
const WORDPRESS_GET_API_URL = process.env.WORDPRESS_GET_API_URL;
const WORDPRESS_APP_ID = process.env.WORDPRESS_APP_ID;
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;
const PHONE_API_URL = process.env.PHONE_API_URL;
const GPT_API_KEY = process.env.GPT_API_KEY;
const apiKey = process.env.API_KEY;
const headers = {
    'x-api-key': apiKey
  };

module.exports = {
    WORDPRESS_POST_API_URL,
    WORDPRESS_GET_API_URL,
    WORDPRESS_APP_ID,
    WORDPRESS_APP_PASSWORD,
    PHONE_API_URL,
    headers,
    GPT_API_KEY
}