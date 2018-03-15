var tweetRequestDatabase = require('../database/tweetRequestDatabase');

exports.getTweetRequest = function(req, res) {
  var tweetRequestId = req.params.tweetRequestId;
  tweetRequestDatabase.selectTweetRequest(tweetRequestId, function(tweetRequest) {
    res.json(tweetRequest);
  });
};

exports.createTweetRequest = function(req, res) {
  var tweetRequest = {
    device_token: req.body.device_token,
    hashtags: req.body.hashtags
  };
  tweetRequestDatabase.insertTweetRequest(tweetRequest, function(tweetRequest) {
    res.json(tweetRequest);
  });
};

exports.deleteTweetRequest = function(req, res) {
  var tweetRequestId = req.params.tweetRequestId;
  tweetRequestDatabase.deleteTweetRequest(tweetRequestId, function() {
    res.status(200).end();
  });
}