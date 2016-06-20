/**
 * ShareController
 *
 * @description :: Server-side logic for managing shares
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
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

};

