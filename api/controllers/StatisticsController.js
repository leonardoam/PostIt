/**
 * StatisticsController
 *
 * @description :: Server-side logic for managing statistics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	top_users: function(req, res) { 

		rowsTotalLikes = {};
		rowsTotalTweetsTimes2 = {};
		influence = [];

		//total de tweets * 2
		select_total_tweets = 'select u.login, count(t.text)*2 from "user" u join tweet t on u.id = t.user group by u.login;'
		//total de likes 
		select_total_likes = 'select u.login, sum(r.reaction)  from tweet t join reaction r on t.id = r.tweet join "user" u on u.id = t.user group by u.login;';
		
		Statistics.query(select_total_tweets, function(err,results){
  			if(err) return res.serverError(err);

  			rowsTotalTweetsTimes2 = results.rows;

  			Statistics.query(select_total_likes, function(err, results){
  				if(err) return res.serverError(err);

  				function get_sum(listt, login_name){
					for (j = 0; j < listt.length; j++) {
						if(listt[j]['login'] == login_name) 
							return listt[j]['?column?'];
					}
					return 0;
				};

			
  				rowsTotalLikes = results.rows;
  		
  				for(i = 0; i < rowsTotalLikes.length; i++) {
  					current_login = rowsTotalLikes[i]['login'];

  					influence.push({login: current_login, 
  						points: parseInt(rowsTotalLikes[i]['sum']) + parseInt(get_sum(rowsTotalTweetsTimes2, current_login))});
  				}

  				/*ordena o resultado para influencia*/
  				influence.sort(function(a, b){
    				if(a['points'] > b['points']) return -1;
    				if(a['points'] < b['points']) return 1;
    				return 0;
				});

  				return res.json(influence);

  			});
  		
  			
		});

	},


	top_publications: function(req, res) { 

		rowsTotalTweets = {};
		top_publications_result = [];

		//tweets com mais likes
		select_more_liked_tweets = 'select t.id, u.login, t.title, t.text, sum(r.reaction) from tweet t join reaction r on t.id = r.tweet join "user" u on u.id=t.user group by t.id, u.login order by sum(r.reaction) desc limit 20;'
		
		Statistics.query(select_more_liked_tweets, function(err,results){
  			if(err) return res.serverError(err);

  			rowsTotalTweets = results.rows;

  			for(k = 0; k < rowsTotalTweets.length; k++) {
  					current_login = rowsTotalTweets[k]['login'];
  					//console.log(rowsTotalTweets[k]);

  					top_publications_result.push({login: current_login,
  						title: rowsTotalTweets[k]['title'],
  						tweet: rowsTotalTweets[k]['text'],
  						points: parseInt(rowsTotalTweets[k]['sum'])});
  				}

  				/*ordena o resultado para influencia*/
  				top_publications_result.sort(function(a, b){
    				if(a['points'] > b['points']) return -1;
    				if(a['points'] < b['points']) return 1;
    				return 0;
				});

				return res.json(top_publications_result);  		
  			
		});

	},
	
};

