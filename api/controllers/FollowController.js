/*
-------------------- FOLLOWS CONTROLLER --------------------
Controlador para follow

Metodos:
    get_followers: busca por quem esta seguindo
    get_follows: busca pelos seguidores
    check_follower: verifica se um usuario segue o outro
    follow_user: seguir um usuario
    unfollow_user: deixar de seguir um usuario
*/

module.exports = {

	get_followers: function(req, res){
		var id_user = req.param('id_user');

		sql = 'SELECT "user".login, "user".id FROM "user" INNER JOIN follow ON follow.follows = "user".id WHERE follow.follower = '+id_user;
		/*
			SELECT "user".login
			FROM "user"
			INNER JOIN follow
			ON follow.follows = "user".id
			WHERE follow.follower = '+id_user
		*/
		Follow.query(sql, function(err,tweets){
			if (err) { return res.negotiate("get_followers_1:" + err); }
			return res.json(tweets.rows);
		});
	},

	get_follows: function(req, res){
		var id_user = req.param('id_user');

		sql = 'SELECT "user".login, "user".id FROM "user" INNER JOIN follow ON follow.follower = "user".id WHERE follow.follows = '+id_user;
		/*
			SELECT "user".login
			FROM "user"
			INNER JOIN follow
			ON follow.follower = "user".id
			WHERE follow.follows = 1
		*/
		Follow.query(sql, function(err,tweets){
			if (err) { return res.negotiate("get_follows_1:" + err); }
			return res.json(tweets.rows);
		});
	},

	check_follower: function(req, res){
		var id_user = req.param('id_user');
		var id_follow = req.param('id_follow');

		Follow.findOne({'follower': id_user, 'follows': id_follow}).exec(function callback(err, found){
			if(err) { return res.negotiate(err); }
			if(!found) return res.json({success: 'false'});
			return res.json({success: 'true'});
		});
	},

	follow_user: function(req, res){
		var d = new Date();
		var t = d.toJSON();

		var follow = {
			follower: req.param('id_user'),
			follows: req.param('id_follow'),
			timestamp: t
		}

		Follow.create(follow).exec(function callback(err, created) {
			if(err) { return res.negotiate(err); }
			created.success = 'true';
			return res.json(created);
		});
	},

	unfollow_user: function(req, res){
		var follow = {
			follower: req.param('id_user'),
			follows: req.param('id_follow'),
		}

		Follow.destroy(follow).exec(function (err) {
			if(err) { return res.negotiate(err); }
			return res.json({success: 'true'});
		});
	}
};

