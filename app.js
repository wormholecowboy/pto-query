require('dotenv').config();
const { App } = require('@slack/bolt');
const { AuthorizationError } = require('@slack/oauth');
const fs = require('fs');
const { google } = require('googleapis');

// Google Auth
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
  });
  const authToken = await auth.getClient();
  return authToken;
}

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.error('Error loading client secret file: ', err);
  getAuthToken(JSON.parse(content), queryPTO);
});

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

function queryPTO() {
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: '1ub70x4_NOCzVDLYcH8fmZis1F7nRG87iCLWQ_pnnnP4',
      range: 'pto-left!A2:B',
    },
    (err, res) => {
      if (err) return console.log('The API returned an error bucko: ' + err);
      const rows = res.data.values;
      if (rows.length) {
        console.log('Name, pto left:');
        rows.map((row) => {
          console.log(`${row[0]}, ${row[1]}`);
        });
      } else {
        console.log('no data found.');
      }
    }
  );
}

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${message.user}>!`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

// console.log(process.env);
