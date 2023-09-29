var Airtable = require('airtable');

exports.handler = async function(event, context) {
  try {
    var base = new Airtable({apiKey: process.env.AIRTABLE_ACCESS_TOKEN}).base('appVZNtd4jkDSXdkN');
    let records = [];

    await new Promise((resolve, reject) => {
      base('Logos').select({
        maxRecords: 3,
        view: "Not Uploaded"
      }).eachPage(function page(recs, fetchNextPage) {
        records = [...records, ...recs];
        fetchNextPage();
      }, function done(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(records),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred' }),
    };
  }
};
