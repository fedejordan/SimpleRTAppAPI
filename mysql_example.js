require('dotenv').load();

var mysql = require('mysql');

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO tweet_request (device_token, hashtags) VALUES ('ExampleDeviceToken', '#Example #Hashtags')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    process.exit();
  });
});