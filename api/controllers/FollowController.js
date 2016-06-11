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
	}
};

