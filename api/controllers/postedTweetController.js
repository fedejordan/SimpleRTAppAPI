exports.createPostedTweet = function(req, res) {
  const maxPostedTweetId = Math.max(...postedTweets.map(postedTweet => postedTweet.id));
  var postedTweetId = isFinite(maxPostedTweetId) ? maxPostedTweetId + 1 : 1;
  var postedTweet = {
    id: postedTweetId.toString(),
    tweet_request_id: req.body.tweet_request_id,
    tweet_id: req.body.tweet_id
  };
  postedTweets.push(postedTweet);
  res.json(postedTweets);
};

var postedTweets = [];