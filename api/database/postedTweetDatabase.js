var databaseHelper = require('../database/databaseHelper');

exports.insertPostedTweet = function(postedTweet, callback) {
	var sqlQuery = "INSERT INTO posted_tweet (tweet_request_id, tweet_id) VALUES ('" + postedTweet.tweet_request_id + "', '" + postedTweet.tweet_id + "')";
	databaseHelper.doQuery(sqlQuery, function() {
		callback();
	});
};