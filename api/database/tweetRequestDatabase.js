var databaseHelper = require('../database/databaseHelper');

exports.insertTweetRequest = function(tweetRequest, callback) {
	var sqlQuery = "INSERT INTO tweet_request (device_token, hashtags) VALUES ('" + tweetRequest.device_token + "', '" + tweetRequest.hashtags + "')";
	databaseHelper.doQuery(sqlQuery, function() {
		sqlQuery = "SELECT * FROM tweet_request WHERE device_token = '" + tweetRequest.device_token + "'";
		databaseHelper.doQuery(sqlQuery, function(tweetRequest) {
			callback(tweetRequest[0]);
		});
	});
};

exports.selectTweetRequest = function(tweetRequestId, callback) {
	var sqlQuery = "SELECT * FROM tweet_request WHERE id = " + tweetRequestId;
	databaseHelper.doQuery(sqlQuery, function(tweetRequest) {
		callback(tweetRequest[0]);
	});
};

exports.deleteTweetRequest = function(tweetRequestId, callback) {
	var sqlQuery = "DELETE FROM tweet_request WHERE id = " + tweetRequestId;
	databaseHelper.doQuery(sqlQuery, function() {
		callback();
	});
};