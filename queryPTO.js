const { google } = require('googleapis');
const { getAuthToken } = require('./getAuthToken');

function queryPTO(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  let data = sheets.spreadsheets.values.get(
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
        return 'here is some data';
      } else {
        console.log('no data found.');
        return 'no data found jerky';
      }
    }
  );
  return data;
}
exports.queryPTO = queryPTO;
