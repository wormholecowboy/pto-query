require('dotenv').config();
const { App } = require('@slack/bolt');
const { google } = require('googleapis');

async function getAuthToken() {
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

  const auth = new google.auth.GoogleAuth({
    keyFile: './credentials.json',
    scopes: SCOPES,
    projectId: 'pto-query',
  });
  const authToken = await auth.getClient();
  //console.log(authToken);
  return authToken;
}

const client = getAuthToken();
const sheets = google.sheets({ version: 'v4', auth: client });

function queryPTO() {
  let data = sheets.spreadsheets.values.get(
    {
      spreadsheetId: '1ub70x4_NOCzVDLYcH8fmZis1F7nRG87iCLWQ_pnnnP4',
      range: 'pto-left!A1:B3',
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
