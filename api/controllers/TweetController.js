/**
 * TweetController
 *
 * @description :: Server-side logic for managing tweets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 
module.exports = {
	
	create_tweet: function(req, res) {
		var tweetToBD = {};

		var user_id = req.param('user_id') || undefined;
		var tweet = req.param('tweet') || undefined;
		var title = req.param('title') || undefined;
		var timestamp =  new Date();

		sails.log("user and tweet " + user_id + tweet);
	
		if(user_id && tweet && title) {
		User.findOne({
  			id:user_id
			}).exec(function (err, found_user){
  				if (err) {
    				return res.negotiate(err);
  				}
 				 if (!found_user) {
 				 	sails.log('Could not find user ' +  user_id + ' sorry.');
    				return res.json({reponse_msg: 'User ' + user_id + ' does not exist'});
  				};

  				sails.log('Found "%s"', found_user);

  				tweetToBD = {'user': user_id, 'title': title, 'text': tweet, 'timestamp': timestamp};

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

		var user_id = req.param('user_id') || undefined;

	
		if(user_id) {
		Tweet.find({
  			user:user_id
			}).exec(function (err, found_tweets){
  				if (err) {
    				return res.negotiate(err);
  				}
 				 if (!found_tweets) {
 				 	sails.log('Could not find user ' +  user_id + ' sorry.');
    				return res.json({reponse_msg: 'there is no tweets for this user'});
  				};

  				sails.log('Found "%s"', found_tweets);

  				return res.json(found_tweets);

			}); //find user exec
		} //there are missing fields from client
		 else 
			return res.json({response_msg: 'invalid request!'});
	}
	
};

