/*
-------------------- REACTION CONTROLLER --------------------
Controlador das reacoes (like/dislike)

Metodos:
    find_all_reactions: busca todas as reacoes de uma publicacao
    set_like: se o usuario ainda n reagiu a uma determinada publicacao, entao adiciona o 'like', se
    		  o usuario ja tiver dado 'like' entao cancela a reacao, mas se o usuario ja tiver dado 'dislike'
    		  entao altera a reacao dele para 'like'
    set_dislike: se o usuario ainda n reagiu a uma determinada publicacao, entao adiciona o 'dislkie', se
    		  	 o usuario ja tiver dado 'dislike' entao cancela a reacao, mas se o usuario ja tiver dado 'like'
    		     entao altera a reacao dele para 'dislike'
*/
module.exports = {
	
	find_all_reactions: function(req,res){
		var id_tweet = req.param('id_tweet');

		sql = 'SELECT t1.likes, t2.dislikes FROM (SELECT count(reaction) AS likes FROM reaction WHERE reaction = 1 AND tweet = '+id_tweet+') t1 CROSS JOIN (SELECT count(reaction) AS dislikes FROM reaction WHERE reaction = 0 AND tweet = '+id_tweet+') t2';
		/*
			SELECT t1.likes, t2.dislikes
			FROM (SELECT count(reaction) AS likes FROM reaction WHERE reaction = 1 AND tweet = '+id_tweet+') t1
			CROSS JOIN
			(SELECT count(reaction) AS dislikes FROM reaction WHERE reaction = 0 AND tweet = '+id_tweet+') t2;
		*/

		Reaction.query(sql, function(err,found){
			if(err) return res.negotiate('find_reactions: 1:'+err);

			return res.json(found.rows[0]);
		});
	},

	set_like: function(req,res){
		var id_user = req.param('id_user');
		var id_tweet = req.param('id_tweet');

		//verifica se o usuario jah reagiu ao tweet
		Reaction.query('SELECT * FROM reaction WHERE "user" = '+id_user+' AND tweet = '+id_tweet, function(err,found){
			if(err) return res.negotiate('1:'+err);

			//se ainda nao reagiu -> entao adiciona o like
			if (found.rowCount == 0){
				var d = new Date();
				var timestamp = d.toJSON();
				var r = {'user': id_user,'tweet': id_tweet, 'reaction': 1, 'timestamp': timestamp};

				Reaction.create(r).exec(function callback(err, reaction_created) {
					if(err) console.log('2:'+err);
					return res.json(reaction_created);
				});
			}

			//se jah reagiu
			//se o usuario jah deu like -> entao retira o like dele
			else if(found.rows[0].reaction == 1){
				Reaction.destroy({'user': id_user,'tweet': id_tweet}).exec(function(err){
					if (err) {return res.negotiate('3:'+err);}
					return res.json({deleted: 'true'});
				});
			}
			
			//se o usuario deu dislike -> entao altera o dislike para like
			else if(found.rows[0].reaction == 0){
				var d = new Date();
				var timestamp = d.toJSON();

				Reaction.update({'user': id_user,'tweet': id_tweet}, {'reaction': 1, 'timestamp': timestamp}).exec(function afterwards(err, updated){
				  	if (err) { return res.negotiate('4:'+err);}
				  	return res.json(updated);
				});
			}
		});
	},

	set_dislike: function(req,res){
		var id_user = req.param('id_user');
		var id_tweet = req.param('id_tweet');

		//verifica se o usuario jah reagiu ao tweet
		Reaction.query('SELECT * FROM reaction WHERE "user" = '+id_user+' AND tweet = '+id_tweet, function(err,found){
			if(err) return res.negotiate('1:'+err);

			//se ainda nao reagiu -> entao adiciona o dislike
			if (found.rowCount == 0){
				var d = new Date();
				var timestamp = d.toJSON();
				var r = {'user': id_user,'tweet': id_tweet, 'reaction': 0, 'timestamp': timestamp};

				Reaction.create(r).exec(function callback(err, reaction_created) {
					if(err) console.log('2:'+err);
					return res.json(reaction_created);
				});
			}

			//se jah reagiu
			//se o usuario jah deu dislike -> entao retira o dislike dele
			else if(found.rows[0].reaction == 0){
				Reaction.destroy({'user': id_user,'tweet': id_tweet}).exec(function(err){
					if (err) {return res.negotiate('3:'+err);}
					return res.json({deleted: 'true'});
				});
			}
			
			//se o usuario deu like -> entao altera o like para dislike
			else if(found.rows[0].reaction == 1){
				var d = new Date();
				var timestamp = d.toJSON();

				Reaction.update({'user': id_user,'tweet': id_tweet}, {'reaction': 0, 'timestamp': timestamp}).exec(function afterwards(err, updated){
				  	if (err) { return res.negotiate('4:'+err);}
				  	return res.json(updated);
				});
			}
		});
	},


};

