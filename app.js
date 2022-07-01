'use strict';

require('dotenv').config();
const { App } = require('@slack/bolt');
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const keys = require('./credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

let jwtClient = new google.auth.JWT({
  keyFile: keys,
  email: keys.client_email,
  key: keys.private_key,
  keyId: keys.private_key_id,
  scopes: SCOPES,
});

jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('Google auth successfully connected!');
  }
});

const sheets = google.sheets({ version: 'v4', auth: jwtClient });
const spreadsheetId = '1ub70x4_NOCzVDLYcH8fmZis1F7nRG87iCLWQ_pnnnP4';
const range = 'pto-left!A1:B3';
const idRange = 'pto-left!A:A';
const ptoRange = 'pto-left!C:C';
const request = {
  spreadsheetId,
  range,
};

async function test() {
  let response = await sheets.spreadsheets.values.get(request);
  let values = response.data.values;
  console.log('values from inside temp fn log: ', values);
  return values;
}

async function getRowIndex(u) {
  let data = await sheets.spreadsheets.values.get(
    {
      spreadsheetId: spreadsheetId,
      range: idRange,
    },
    (err, res) => {
      if (err) return console.log('The API returned an error bucko: ' + err);
      res.findIndex((val) => {
        return val == u;
      });
    }
  );
  return data;
}

async function queryPTO() {
  let data = await sheets.spreadsheets.values.get(
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
      }
      console.log('no data found.');
      return 'no data found jerky';
    }
  );
  return data;
}

// Slack Auth
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

let user;
function setUser(u) {
  user = u;
}

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  setUser(message.user);
  console.log('user id: ', user);
  //let rowIndex = getRowIndex(user);
  // console.log(rowIndex);
  //let res = queryPTO();
  //await say(`${res}`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
  const temp = await test();
  console.log('values from main fn log: ', temp);
})();
