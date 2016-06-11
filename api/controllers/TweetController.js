/**
 * TweetController
 *
 * @description :: Server-side logic for managing tweets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 
module.exports = {

	create_tweets: function(req, res) {
		var tweets = [
			{
				'user': 1,
				'title': 'a',
				'text': 'aaa',
				'timestamp': '2016-06-11T20:43:17.463Z'
			},
			{
				'user': 2,
				'title': 'b',
				'text': 'bbb',
				'timestamp': '2016-06-11T20:45:17.463Z'
			},
			{
				'user': 2,
				'title': 'c',
				'text': 'ccc',
				'timestamp': '2016-06-11T20:50:17.463Z'
			},
			{
				'user': 2,
				'title': 'd',
				'text': 'ddd',
				'timestamp': '2016-06-11T20:55:17.463Z'
			},
			{
				'user': 1,
				'title': 'e',
				'text': 'eee',
				'timestamp': '2016-06-11T21:00:17.463Z'
			},
			{
				'user': 2,
				'title': 'f',
				'text': 'fff',
				'timestamp': '2016-06-11T21:05:17.463Z'
			},
			{
				'user': 2,
				'title': 'g',
				'text': 'ggg',
				'timestamp': '2016-06-11T21:10:17.463Z'
			}
		];

		Tweet.create(tweets).exec(function callback(error, users_created) {
			if(error) {
				console.log(error);
			}
			else
				console.log("Tweets created successfully..");

			return res.json(users_created);
		})
	},



	create_tweet: function(req, res) {
		var tweetToBD = {};

		var id_user = req.param('id_user') || undefined;
		var tweet = req.param('tweet') || undefined;
		var title = req.param('title') || undefined;
		//var timestamp =  new Date();
		var d = new Date();
		var timestamp = d.toJSON();

		sails.log("user and tweet " + id_user + tweet);
	
		if(id_user && tweet && title) {
		User.findOne({
  			id:id_user
			}).exec(function (err, found_user){
  				if (err) {
    				return res.negotiate(err);
  				}
 				 if (!found_user) {
 				 	sails.log('Could not find user ' +  id_user + ' sorry.');
    				return res.json({reponse_msg: 'User ' + id_user + ' does not exist'});
  				};

  				sails.log('Found "%s"', found_user);

  				tweetToBD = {'user': id_user, 'title': title, 'text': tweet, 'timestamp': timestamp};

  				Tweet.create(tweetToBD).exec(function callback(error, tweets_created) {
					if(error) {
						console.log("Error while creating tweets...");
						console.log(error);
						return res.json({response_msg: 'error while creating tweet!'});
					}

					console.log("Tweets created successfully..");

					return res.json({response_msg: 'ok'});
				}); // create tweet exec

			}); //find user exec
		} //there are missing fields from client
		 else 
			return res.json({response_msg: 'invalid request!'});
	}, 

	get_tweets: function(req, res) {

		var id_user = req.param('id_user') || undefined;

		if(id_user) {
		Tweet.find({'user':id_user}).exec( function callback(err, found_tweets){
  				if (err) {
    				return res.negotiate(err);
  				}
 				if (!found_tweets) {
 				 	sails.log('Could not find user ' +  id_user + ' sorry.');
    				return res.json({reponse_msg: 'there is no tweets for this user'});
  				};

  				//sails.log('Found "%s"', found_tweets);

  				return res.json(found_tweets);

			}); //find user exec
		} //there are missing fields from client
		 else 
			return res.json({response_msg: 'invalid request!'});
	}
	
};

