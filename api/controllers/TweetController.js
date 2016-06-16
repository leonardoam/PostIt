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
		var d = new Date();
		var timestamp = d.toJSON();

		sails.log("user and tweet " + id_user + tweet);
	
		if(id_user && tweet && title) {

			/*processa imagens, videos e links nos tweets
			/*dada pelo simbolo $i*/
			function urlifyImages(text) {
    			var urlRegex = /(\$i:https?:\/\/[^\s]+)/g;
   				return text.replace(urlRegex, function(url) {
    		    //slice(3) tira o $i: da url
        		return '<img src="' + url.slice(3) + '">';
    		 })
    
			};

			function urlifyLinks(text) {
				var urlRegex = /(\$l:https?:\/\/[^\s]+)/g;
    			return text.replace(urlRegex, function(url) {
    		  	  return '<a href="' + url.slice(3) + '"> ' + url.slice(3) + ' </a>';
    				})		
			};

			function urlifyVideos(text) {
				var urlRegex = /(\$v:https?:\/\/[^\s]+)/g;
    			return text.replace(urlRegex, function(url) {
    		  	  //return '<a href="' + url.slice(3) + '"> ' + url.slice(3) + ' </a>';
    		  	  return '<iframe width="560" height="315" src="https://www.youtube.com/embed/FAyE1ApN8MA" frameborder="0" allowfullscreen></iframe>'
    				})		
			};

			function urlifyVideos(text) {
				var urlRegex = /(\$v:https?:\/\/[^\s]+)/g;
    			return text.replace(urlRegex, function(url) {
    			video = url.split('?');
    			video = video[video.length -1].slice(2)
    			return '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + video + ' frameborder="0" allowfullscreen></iframe>';
    			})
    
			};

			tweet = urlifyImages(tweet);
			tweet = urlifyLinks(tweet);
			tweet = urlifyVideos(tweet);
			/*fim do processamento */

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
	},
	
	timeline: function(req,res){
		var id_user = req.param('id_user');
		tweetsList = [];

		select1 = 'SELECT "user".login, "user".id FROM "user" INNER JOIN follow ON "user".id = follow.follows WHERE follow.follower = '+id_user+' UNION ALL SELECT "user".login, "user".id FROM "user" WHERE "user".id = '+id_user;

		//seleciona as pessoas que o usuario segue, inclusive ele mesmo
		Tweet.query(select1, function(err,follows){
			if (err) { return res.negotiate("1:" + err); }
			else{
				
				var find_tweets = function(id, cb){
    				
					select2 = 'SELECT tweet.title, tweet.text, tweet.timestamp, "user".login FROM tweet INNER JOIN "user" ON "user".id = tweet.user WHERE tweet.user = '+id;

					//agora procura os tweets que as pessoas tem e adiciona numa lista de obj
					Tweet.query(select2, function (err,tweets){
						if(err) { return res.negotiate("2:" + err); }
						else {

							for(j = 0; j < tweets.rows.length; j++){
								
								time = tweets.rows[j].timestamp.split('-');
								tweets.rows[j].year = time[0];
								tweets.rows[j].month = time[1];
								time = time[2].split('T');
								tweets.rows[j].day = time[0];
								time = time[1].split(':');
								tweets.rows[j].hour = time[0];

								//colocando no horario de brasilia (-3 horas)
								a = Number(tweets.rows[j].hour);
								if((a-3) >= 0 ) tweets.rows[j].hour = Number(tweets.rows[j].hour) - 3;
								else{
									tweets.rows[j].hour = 24 - (3 - a);
									tweets.rows[j].day = Number(tweets.rows[j].day) - 1;
								}

								tweets.rows[j].minute = time[1];

								tweetsList.push(tweets.rows[j]);
							}

							cb();
						}
					});
				}

				tweets_ids = [];
				for(i = 0; i < follows.rows.length; i++)
					tweets_ids.push(follows.rows[i].id);

				async.forEach(tweets_ids, find_tweets, function(err){
					if(err) {console.log("1: " + err);}
					else{
						return res.json(tweetsList);
					}
				});
			}
		});
	}
};

