/**
 * TweetsController
 *
 * @description :: Server-side logic for managing tweets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create_tweets: function(req, res) {
		var tweets = [
		{'user': '1', 'title': 'titulo1', 'text': 'text from tweet', 'timestamp': '1900-12-27T00:00:00Z'},
		{'user': '2', 'title': 'titulo2', 'text': 'text from tweet', 'timestamp': '1912-12-27T00:00:00Z'}
		
		];

		Tweets.create(tweets).exec(function callback(error, tweets_created) {
			if(error) {
				console.log("Error while creating tweets...");
			}

			console.log("Tweets created successfully..");

			return res.json(tweets_created);
		})
	},
	
};

