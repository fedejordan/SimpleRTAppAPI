module.exports = function(app) {
  var tweetRequestController = require('../controllers/tweetRequestController');

  app.route('/tweetRequest/:tweetRequestId')
    .get(tweetRequestController.getTweetRequest)
    .delete(tweetRequestController.deleteTweetRequest);

  app.route('/tweetRequest')
    .post(tweetRequestController.createTweetRequest);
};