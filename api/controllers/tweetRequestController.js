exports.getTweetRequest = function(req, res) {
  var tweetRequest = tweetRequests.find(tweetRequest => tweetRequest.id === req.params.tweetRequestId);
  res.json(tweetRequest);
};

exports.createTweetRequest = function(req, res) {
  const maxTweetRequestId = Math.max(...tweetRequests.map(tweetRequest => tweetRequest.id));
  var tweetRequestId = maxTweetRequestId + 1;
  var tweetRequest = {
    id: tweetRequestId.toString(),
    device_token: req.body.device_token,
    hashtags: req.body.hashtags
  };
  tweetRequests.push(tweetRequest);
  res.json(tweetRequest);
};

exports.deleteTweetRequest = function(req, res) {
    tweetRequests = tweetRequests.filter(function(tweetRequest) {
      return tweetRequest.id != req.params.tweetRequestId;
    });
    res.json(tweetRequests);
}

var tweetRequests = [{
  id: '1',
  device_token: '1',
  hashtags: "#ios #swift"
}, {
  id: '2',
  device_token: '2',
  hashtags: "#android #kotlin"
}, {
  id: '3',
  device_token: '3',
  hashtags: "#backend #nodejs"
}];