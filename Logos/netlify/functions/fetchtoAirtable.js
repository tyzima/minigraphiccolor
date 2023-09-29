var Airtable = require('airtable');

exports.handler = async function(event, context) {
  var base = new Airtable({apiKey: process.env.AIRTABLE_ACCESS_TOKEN}).base('appVZNtd4jkDSXdkN');
  let records = [];

  await base('Logos').select({
    maxRecords: 3,
    view: "Not Uploaded"
  }).eachPage(function page(recs, fetchNextPage) {
    records = [...records, ...recs];
    fetchNextPage();
  }, function done(err) {
    if (err) { console.error(err); return; }
  });

  return {
    statusCode: 200,
    body: JSON.stringify(records)
  };
};
