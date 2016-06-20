/**
 * MaintenanceController
 *
 * @description :: Server-side logic for managing maintenances
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	export_schema: function(req, res) {
		var PostgresSchema = require('pg-json-schema-export');
		var connection = {	
  		user: 'postgres',
  		password: '7486612',
  		host: 'localhost',
  		port: 5432,
  		database: 'postit'
		};
	
		PostgresSchema.toJSON(connection, 'public')
  		.then(function (schemas) {
  			res.json(schemas);
  		})
  		.catch(function (error) {
  	 	console.log(error);
  		});		

	},

	export_data: function(req, res) {
		var exporter = require('pg-json-data-export');
		var connection = {	
  		user: 'postgres',
  		password: '7486612',
  		host: 'localhost',
  		port: 5432,
  		database: 'postit'
		};
		
		exporter.toJSON(connection, 'public')
  		.then(function (alldata) {
   		 	//console.log(dump.table1.rows);
   		 	res.json(alldata)
  		})
  		.catch(function (error) {
  	 		console.log(error);
  	 		res.json(error);
  		});		

	},

	import_data: function(req, res) {
		var user_table = req.param('user');
		var tweet_table = req.param('tweet');
		var group_table = req.param('group');
		var group_users_table = req.param('group_users__user_groups');
		var reaction_table = req.param('reaction');

		var result = {};
	
		console.log("==> IMPORTING USERS: ");
		//user table loop
		for(var i = 0; i < user_table.rows.length; i++) {
			console.log(user_table.rows[i]);
			User.create(user_table.rows[i]).exec(function callback(error, user_created) {
				if(error) {
					console.log("Error while creating user...");
					console.log(error);
					return res.json({msg: 'error importing user'});
				}

				console.log("User created successfully..");

			});

		}


		console.log("==> IMPORTING TWEETS: ");
		//tweet table loop
		for(var i = 0; i < tweet_table.rows.length; i++) {
			//console.log(tweet_table.rows[i]);
			Tweet.create(tweet_table.rows[i]).exec(function callback(error, tweet_created) {
				if(error) {
					console.log("Error while importing tweets...");
					console.log(error);
					return res.json({response_msg: 'error while importing tweets!'});
				}
				
			}); 

		}

		

		console.log("==> IMPORTING GROUPS: ");
		//group table loop
		for(var i = 0; i < group_table.rows.length; i++) {
			//console.log(group_table.rows[i]);
			Group.create(group_table.rows[i]).exec(function callback(error, group_created) {
					if(error) {
						console.log(error);
						return res.json({response_msg: 'error while importing groups!'});
					}
					else{
						console.log("Group created successfully..");
						//return res.json(group_created);
					}

				});
		}

		console.log("==> IMPORTING GROUPS-USERS : ");
		//group-users (mxn) table loop => insert users into grous
		for(var i = 0; i < group_users_table.rows.length; i++) {

			id_group = group_users_table.rows[i]['group_users'];
			id_user = group_users_table.rows[i]['user_groups'];
			select = 'INSERT INTO "group_users__user_groups" (group_users, user_groups) values (\'' + id_group + '\', \'' + id_user + '\');';
			//console.log(select);
			Group.query(select, function(err,results){
  					if(err) {
  						console.log("Error importing groups-users"+ err);
  						return res.json({msg: "Error while importing groups-users"});
  					}
  					//console.log("usuario inserido no grupo com sucesso!");
  					console.log("user inserted to group successfully..");
			});
		
		}


		console.log("==> IMPORTING REACTION : ");
		//group-users (mxn) table loop
		for(var i = 0; i < reaction_table.rows.length; i++) {
			//console.log(reaction_table.rows[i]);
			Reaction.create(reaction_table.rows[i]).exec(function callback(err, reaction_created) {
					if(err) {
						console.log('2:'+err);
						return res.json({response_msg: 'error while importing reactions!'});
					}
					console.log("reaction created ");
				});

		}

		result = {created_users: user_table.rows.length,
				  created_tweets: tweet_table.rows.length,
				  created_groups: group_table.rows.length,
				  created_groups_users: group_users_table.rows.length,
				  created_reactions: reaction_table.rows.length
		};

		res.json(result);

	},
	
};

