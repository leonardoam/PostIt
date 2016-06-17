/**
 * FollowController
 *
 * @description :: Server-side logic for managing follows
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create_follow: function(req, res) {
		var follow = [
			{
				"follower": 1,
				"follows": 2,
				"timestamp": "2016-05-18T20:43:17.463Z"
			},
			{
				"follower": 1,
				"follows": 3,
				"timestamp": "2017-05-18T20:43:17.463Z"
			},
			{
				"follower": 2,
				"follows": 1,
				"timestamp": "2018-05-18T20:43:17.463Z"
			}
		];

		Follow.create(follow).exec(function callback(error, users_created) {
			if(error) {
				console.log(error);
			}

			console.log("Follows created successfully..");

			return res.json(users_created);
		})
	},

	get_followers: function(req, res){
		var id_user = req.param('id_user');

		Follow.find({'follower':id_user}).exec(function callback(err, found){
			if (err) {
    			return res.negotiate(err);
  			}
  			else {
				return res.json(found);
  			}
		});
	},

	get_follows: function(req, res){
		var id_user = req.param('id_user');

		Follow.find({'follows':id_user}).exec(function callback(err, found){
			if (err) {
    			return res.negotiate(err);
  			}
  			else {
  				return res.json(found);
  			}
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

