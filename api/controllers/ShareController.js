/*
-------------------- SHARE CONTROLLER --------------------
Controlador das republicacoes

Metodos:
    add_share: adiciona uma republicacao
    delete_share: delete uma republicacao
*/
module.exports = {
	
	add_share: function(req,res){
		var id_user = req.param('id_user');
		var id_tweet = req.param('id_tweet');

		console.log('id_user: '+id_user+'         id_tweet: '+id_tweet);

		//verifica se o usuario ja republicou a postagem
		Share.findOne({'user': id_user, 'tweet': id_tweet}).exec(function callback(err, found){
			if(err) return res.negotiate('share: 1:'+err);
			if (!found){ //se ainda nao entao adiciona no banco
				var d = new Date();
				var timestamp = d.toJSON();
				Share.create({'user': id_user, 'tweet': id_tweet, 'timestamp': timestamp}).exec(function callback(err, created) {
					if(err) return res.negotiate('share: 2:'+err);

					created.success = "true";
					return res.json(created);
				});
			}
			else{
				return res.json({success: "false"});
			}
		});
	},

	delete_share: function(req,res){
		var id_tweet = req.param('id_tweet') || undefined;

		console.log(id_tweet);
		Share.destroy({'tweet':id_tweet}).exec(function(err){
			if (err) {return res.negotiate('1:'+err);}
			return res.json({success: "true"});
		});
	},

};

