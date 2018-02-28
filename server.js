var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var tweetRequestRoutes = require('./api/routes/tweetRequestRoutes');
tweetRequestRoutes(app);
var postedTweetRoutes = require('./api/routes/postedTweetRoutes');
postedTweetRoutes(app);

app.listen(port);

console.log('SimpleRTAppAPI server started on: ' + port);