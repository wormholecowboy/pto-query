'use strict';

require('dotenv').config();
const { App } = require('@slack/bolt');
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const keys = require('./credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// async function getAuthToken() {
//   const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

//   const auth = new google.auth.GoogleAuth({
//     keyFile: './credentials.json',
//     scopes: SCOPES,
//     projectId: 'pto-query',
//   });
//   const authToken = await auth.getClient();
//   console.log(authToken);
//   return authToken;
// }
// const client = getAuthToken();

// async function jwtAuth() {
//   const client = new JWT({
//     email: keys.client_email,
//     key: keys.private_key,
//     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
//   });
//   const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
//   const res = await client.request({ url });
//   console.log(res.data);
// }

// jwtAuth().catch(console.error);

let jwtClient = new google.auth.JWT({
  keyFile: keys,
  email: keys.client_email,
  key: keys.private_key,
  keyId: keys.private_key_id,
  scopes: SCOPES,
});

console.log(jwtClient);

jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('Google auth successfully connected!');
  }
});

//console.log(jwtClient);

const sheets = google.sheets({ version: 'v4', auth: jwtClient });
const spreadsheetId = '1ub70x4_NOCzVDLYcH8fmZis1F7nRG87iCLWQ_pnnnP4';
const range = 'pto-left!A1:B3';

function queryPTO() {
  let data = sheets.spreadsheets.values.get(
    {
      spreadsheetId: spreadsheetId,
      range: range,
    },
    (err, res) => {
      if (err) return console.log('The API returned an error bucko: ' + err);
      const rows = res.data.values;
      if (rows.length) {
        console.log('Name, pto left:');
        rows.map((row) => {
          console.log(`${row[0]}, ${row[1]}`);
        });
        return 'here is some data';
      } else {
        console.log('no data found.');
        return 'no data found jerky';
      }
    }
  );
  return data;
}

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
  console.log(res);
  // say() sends a message to the channel where the event was triggered
  await say('hiya');
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
