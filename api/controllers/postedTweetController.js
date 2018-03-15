var postedTweetDatabase = require('../database/postedTweetDatabase');

exports.createPostedTweet = function(req, res) {
  var postedTweet = {
    tweet_request_id: req.body.tweet_request_id,
    tweet_id: req.body.tweet_id
  };
  postedTweetDatabase.insertPostedTweet(postedTweet, function() {
    res.status(200).end();
  });
};