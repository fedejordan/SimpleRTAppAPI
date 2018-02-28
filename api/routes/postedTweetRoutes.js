module.exports = function(app) {
  var postedTweetController = require('../controllers/postedTweetController');

  app.route('/postedTweet')
    .post(postedTweetController.createPostedTweet);
};