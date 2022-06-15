require('dotenv').config();
const { App } = require('@slack/bolt');
const { AuthorizationError } = require('@slack/oauth');
const fs = require('fs');
const { getAuthToken } = require('./getAuthToken');
const { queryPTO } = require('./queryPTO');

// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.error('Error loading client secret file: ', err);
//   getAuthToken(JSON.parse(content), queryPTO);
// });

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

// // Listens to incoming messages that contain "hello"
// app.message('hello', async ({ message, say }) => {
//   // say() sends a message to the channel where the event was triggered
//   await say(`Hey there <@${message.user}>!`);
// });

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  let res = await queryPTO();
  // say() sends a message to the channel where the event was triggered
  await say(res);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
