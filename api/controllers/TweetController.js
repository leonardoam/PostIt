/*
-------------------- TWEET CONTROLLER --------------------
Controlador das publicacoes

Metodos:
    create_tweet: cria um tweet, verificando as tags $i, $v, etc
    get_tweets: busca as publicacoes de um usuario especifico
    delete_tweet: deleta uma publicacao
    timeline: busca todos as publicacoes e republicacoes feitas pelo usuario e por quem ele segue
*/
 
module.exports = {

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
        		return '<br><img src="' + url.slice(3) + '" width=350 height=350">';
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
    			video = url.split('?');
    			video = video[video.length -1].slice(2)
    			return '<br><iframe width="560" height="315" src="https://www.youtube.com/embed/' + video + '" frameborder="0" allowfullscreen></iframe>';
    			})
    
			};

			function urlifyGroups(text) {
				var urlRegex = /(\@[^\s]+)/g;
				return text.replace(urlRegex, function(url) {
    			return '<a href="">' + url + '</a>';
    			})

			};

			tweet = urlifyImages(tweet);
			tweet = urlifyLinks(tweet);
			tweet = urlifyVideos(tweet);
			//tweet = urlifyGroups(tweet);
			/*fim do processamento */

			console.log("tweet final:");
			console.log(tweet);


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
		} //first if(id_user && tweet && title) ... there are missing fields from client
		 else 
			return res.json({response_msg: 'invalid request!'});
	}, 

	get_tweets: function(req, res) {
		var id_user = req.param('id_user') || undefined;
		var tweetsList = [];
		
		sql = 'SELECT "user".login, tweet.title, tweet.text, tweet.timestamp, tweet.id FROM "user" INNER JOIN tweet ON tweet.user = "user".id WHERE "user".id = +'+id_user;
		/*
			SELECT "user".login, tweet.title, tweet.text, tweet.timestamp, tweet.id
			FROM "user"
			INNER JOIN tweet
			ON tweet.user = "user".id
			WHERE "user".id = 1
		*/

		Tweet.query(sql, function(err,tweets){
			if (err) { return res.negotiate("get_tweet_1:" + err); }
			
			for(i = 0; i < tweets.rowCount; i++){
				
				serverService.divide_timestamp(tweets.rows[i].timestamp, "", function(result){
					tweets.rows[i].year = result.year;
					tweets.rows[i].month = result.month;
					tweets.rows[i].day = result.day;
					tweets.rows[i].hour = result.hour;
					tweets.rows[i].minute = result.minute;

					tweetsList.push(tweets.rows[i]);
				});
			}

			sql = 'SELECT * FROM ( SELECT "user".login as share_login, tweet.title, tweet.text, tweet.timestamp as share_timestamp, share.timestamp, tweet.id as A FROM "user" INNER JOIN share ON share."user" = "user".id INNER JOIN tweet ON tweet.id = share.tweet WHERE "user".id = '+id_user+' ) t1 INNER JOIN ( SELECT "user".login, tweet.id as id FROM "user" INNER JOIN tweet ON tweet.user = "user".id ) t2 ON t1.A = t2.id';
			/*
			SELECT * FROM
				(
				SELECT "user".login as share_login, tweet.title, tweet.text, tweet.timestamp as share_timestamp, share.timestamp, tweet.id as A
				FROM "user"
				INNER JOIN share
				ON share."user" = "user".id
				INNER JOIN tweet
				ON tweet.id = share.tweet
				WHERE "user".id = '+id_user+'
				) t1

			INNER JOIN
				(
				SELECT "user".login, tweet.id as id
				FROM "user"
				INNER JOIN tweet
				ON tweet.user = "user".id
				) t2
			ON t1.A = t2.id
			*/

			Tweet.query(sql, function(err,tweets){
				if (err) { return res.negotiate("get_tweet_2:" + err); }

				for(i = 0; i < tweets.rowCount; i++){
					tweets.rows[i].share = true;

					serverService.divide_timestamp(tweets.rows[i].timestamp, tweets.rows[i].share_timestamp, function(result){
						tweets.rows[i].year = result.year;
						tweets.rows[i].month = result.month;
						tweets.rows[i].day = result.day;
						tweets.rows[i].hour = result.hour;
						tweets.rows[i].minute = result.minute;

						tweets.rows[i].syear = result.syear;
						tweets.rows[i].smonth = result.smonth;
						tweets.rows[i].sday = result.sday;
						tweets.rows[i].shour = result.shour;
						tweets.rows[i].sminute = result.sminute;

						tweetsList.push(tweets.rows[i]);
					});
				}
				return res.json(tweetsList);
			});
		});
	},

	delete_tweet: function(req,res){
		var id_tweet = req.param('id_tweet') || undefined;

		Reaction.destroy({'tweet':id_tweet}).exec(function(err){
			if (err) {return res.negotiate('5:'+err);}
			Share.destroy({'tweet':id_tweet}).exec(function(err){
					if (err) {return res.negotiate('4:'+err);}
					Tweet.destroy({'id':id_tweet}).exec(function(err){
						if (err) {return res.negotiate('2:'+err);}
						return res.json({success: "true"});
				});
			});
		});
	},
	
	timeline: function(req,res){
		var id_user = req.param('id_user');
		var tweetsList = [];
		/*
		tweetlist = {
			login 			-> login do usuario q fez o tweet
			title			-> titulo do tweet
			text			-> texto do tweet
			timestamp 		-> hora que o tweet foi feito

			share 			-> booleano para indicar se o tweet eh uma republicacao de outro tweet
			share_login 	-> login de quem republicou
			share_timestamp -> horario que o usuario republicou
		}
		*/

		sql = 'SELECT "user".login, tweet.title, tweet.text, tweet.timestamp, tweet.id FROM "user" INNER JOIN follow ON "user".id = follow.follows INNER JOIN tweet ON "user".id = tweet.user WHERE follow.follower = '+id_user+' UNION ALL SELECT "user".login, tweet.title, tweet.text, tweet.timestamp, tweet.id FROM "user" INNER JOIN tweet ON "user".id = tweet.user WHERE "user".id = '+id_user;
		/*
		SELECT "user".login, tweet.title, tweet.text, tweet.timestamp
		FROM "user"
		INNER JOIN follow
		ON "user".id = follow.follows
		INNER JOIN tweet
		ON "user".id = tweet.user
		WHERE follow.follower = '+id_user+'

		UNION ALL

		SELECT "user".login, tweet.title, tweet.text, tweet.timestamp
		FROM "user"
		INNER JOIN tweet
		ON "user".id = tweet.user
		WHERE "user".id = '+id_user
		*/


		//seleciona os tweets para exibir na timeline
		Tweet.query(sql, function(err,tweets){
			if (err) { return res.negotiate("timeline_1:" + err); }
			
			for(i = 0; i < tweets.rowCount; i++){
				
				serverService.divide_timestamp(tweets.rows[i].timestamp, "", function(result){
					tweets.rows[i].year = result.year;
					tweets.rows[i].month = result.month;
					tweets.rows[i].day = result.day;
					tweets.rows[i].hour = result.hour;
					tweets.rows[i].minute = result.minute;

					tweetsList.push(tweets.rows[i]);
				});
			}

			sql = 'SELECT * FROM ( SELECT "user".login as share_login, tweet.title, tweet.text, tweet.timestamp as share_timestamp, share.timestamp, tweet.id as A FROM "user" INNER JOIN follow ON follow.follows = "user".id INNER JOIN share ON share."user" = "user".id INNER JOIN tweet ON tweet.id = share.tweet WHERE follow.follower = '+id_user+' UNION ALL SELECT "user".login as share_login, tweet.title, tweet.text, tweet.timestamp as share_timestamp, share.timestamp, tweet.id as A FROM "user" INNER JOIN share ON share."user" = "user".id INNER JOIN tweet ON tweet.id = share.tweet WHERE "user".id = '+id_user+' ) t1 INNER JOIN ( SELECT "user".login, tweet.id as id FROM "user" INNER JOIN tweet ON tweet.user = "user".id ) t2 ON t1.A = t2.id';
			/*
			SELECT * FROM
				(
				SELECT "user".login as share_login, tweet.title, tweet.text, tweet.timestamp as share_timestamp, share.timestamp, tweet.id as A
				FROM "user"
				INNER JOIN follow
				ON follow.follows = "user".id
				INNER JOIN share
				ON share."user" = "user".id
				INNER JOIN tweet
				ON tweet.id = share.tweet
				WHERE follow.follower = 1

				UNION ALL

				SELECT "user".login as share_login, tweet.title, tweet.text, tweet.timestamp as share_timestamp, share.timestamp, tweet.id as A
				FROM "user"
				INNER JOIN share
				ON share."user" = "user".id
				INNER JOIN tweet
				ON tweet.id = share.tweet
				WHERE "user".id = 1
				) t1

			INNER JOIN
				(
				SELECT "user".login, tweet.id as id
				FROM "user"
				INNER JOIN tweet
				ON tweet.user = "user".id
				) t2
			ON t1.A = t2.id
			*/

			//seleciona os tweets que foram republicados para exibir na timeline
			Tweet.query(sql, function(err,tweets){
				if (err) { return res.negotiate("timeline_2:" + err); }

				for(i = 0; i < tweets.rowCount; i++){
					tweets.rows[i].share = true;

					serverService.divide_timestamp(tweets.rows[i].timestamp, tweets.rows[i].share_timestamp, function(result){
						tweets.rows[i].year = result.year;
						tweets.rows[i].month = result.month;
						tweets.rows[i].day = result.day;
						tweets.rows[i].hour = result.hour;
						tweets.rows[i].minute = result.minute;

						tweets.rows[i].syear = result.syear;
						tweets.rows[i].smonth = result.smonth;
						tweets.rows[i].sday = result.sday;
						tweets.rows[i].shour = result.shour;
						tweets.rows[i].sminute = result.sminute;

						tweetsList.push(tweets.rows[i]);
					});
				}

				return res.json(tweetsList);
			});

		});
	},

};
