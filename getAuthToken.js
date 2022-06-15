const { google } = require('googleapis');

async function getAuthToken() {
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

  const auth = new google.auth.GoogleAuth({
    keyFile: './credentials.json',
    scopes: SCOPES,
  });
  const authToken = await auth.getClient();
  return authToken;
}

exports.getAuthToken = getAuthToken;
