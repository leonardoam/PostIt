/*
-------------------- MAINTENANCE CONTROLLER --------------------
Controlador para export e import de dados

OBS: Nao esquecer de mudar os dados para acesso no postgres (user, passowrd, host,port,database)

Metodos:
    export_schema: exportar o esquema json utilizado para o banco
    export_data: exporta os dados mantidos no banco
    import_data: importa os dados a partir de um json e adiciona no banco
    create_fk: cria todoas as chaves estrangeiras do banco
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
		var share_table = req.param('share');
		var follow_table = req.param('follow');
		var result = {};
	
		console.log("==> IMPORTING USERS: ");
		for(var i = 0; i < user_table.rows.length; i++) {
			var data = {
				'name': user_table.rows[i].name,
				'login': user_table.rows[i].login,
				'password': user_table.rows[i].password,
				'birthday': user_table.rows[i].birthday,
				'bio': user_table.rows[i].bio,
				'email': user_table.rows[i].email
			};

			User.create(data).exec(function callback(error, user_created) {
				if(error) {
					console.log("Error while creating user...");
					console.log(error);
					return res.json({msg: 'error importing user'});
				}

				console.log("User created successfully..");
			});
		}

		console.log("==> IMPORTING TWEETS: ");
		for(var i = 0; i < tweet_table.rows.length; i++) {
			var data = {
				'user': tweet_table.rows[i].user,
				'title': tweet_table.rows[i].title,
				'text': tweet_table.rows[i].text,
				'timestamp': tweet_table.rows[i].timestamp
			};
			Tweet.create(data).exec(function callback(error, tweet_created) {
				if(error) {
					console.log("Error while importing tweets...");
					console.log(error);
					return res.json({response_msg: 'error while importing tweets!'});
				}
				
			}); 
		}

		console.log("==> IMPORTING GROUPS: ");
		for(var i = 0; i < group_table.rows.length; i++) {
			var data = {
				'name': group_table.rows[i].name,
				'id': group_table.rows[i].id
			};
			Group.create(data).exec(function callback(error, group_created) {
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
		for(var i = 0; i < group_users_table.rows.length; i++) {

			id_group = group_users_table.rows[i]['group_users'];
			id_user = group_users_table.rows[i]['user_groups'];
			select = 'INSERT INTO "group_users__user_groups" (group_users, user_groups) values (\'' + id_group + '\', \'' + id_user + '\');';
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
		for(var i = 0; i < reaction_table.rows.length; i++) {
			var data = {
				'tweet': reaction_table.rows[i].tweet,
				'user': reaction_table.rows[i].user,
				'reaction': reaction_table.rows[i].reaction,
				'timestamp': reaction_table.rows[i].timestamp
			};
			Reaction.create(data).exec(function callback(err, reaction_created) {
					if(err) {
						console.log('2:'+err);
						return res.json({response_msg: 'error while importing reactions!'});
					}
					console.log("reaction created ");
				});

		}

		console.log("==> IMPORTING SHARE : ");
		for(var i = 0; i < share_table.rows.length; i++) {
			var data = {
				'tweet': share_table.rows[i].tweet,
				'user': share_table.rows[i].user,
				'timestamp': share_table.rows[i].timestamp
			};
			Share.create(data).exec(function callback(err, reaction_created) {
					if(err) {
						console.log('2:'+err);
						return res.json({response_msg: 'error while importing reactions!'});
					}
					console.log("share created ");
				});
		}

		console.log("==> IMPORTING FOLLOW : ");
		for(var i = 0; i < follow_table.rows.length; i++) {
			var data = {
				'follower': follow_table.rows[i].follower,
				'follows': follow_table.rows[i].follows,
				'timestamp': follow_table.rows[i].timestamp
			};
			Follow.create(data).exec(function callback(err, reaction_created) {
					if(err) {
						console.log('2:'+err);
						return res.json({response_msg: 'error while importing reactions!'});
					}
					console.log("share created ");
				});
		}

		result = {created_users: user_table.rows.length,
				  created_tweets: tweet_table.rows.length,
				  created_groups: group_table.rows.length,
				  created_groups_users: group_users_table.rows.length,
				  created_reactions: reaction_table.rows.length,
				  created_shares: share_table.rows.length,
				  created_shares: follow_table.rows.length
		};

		return res.json(result);

	},
	
	create_fk: function(req, res) {

		sql = 'ALTER TABLE tweet ADD CONSTRAINT user_fkey FOREIGN KEY ("user") REFERENCES "user" (id) ON UPDATE CASCADE ON DELETE RESTRICT; ALTER TABLE follow ADD CONSTRAINT follower_fkey FOREIGN KEY (follower) REFERENCES "user" (id) ON UPDATE CASCADE ON DELETE RESTRICT; ALTER TABLE follow ADD CONSTRAINT follow_fkey FOREIGN KEY (follows) REFERENCES "user" (id) ON UPDATE CASCADE ON DELETE RESTRICT; ALTER TABLE "group" ADD CONSTRAINT user_fkey FOREIGN KEY ("id") REFERENCES "user" (id) ON UPDATE CASCADE ON DELETE RESTRICT; ALTER TABLE reaction ADD CONSTRAINT user_fkey FOREIGN KEY ("user") REFERENCES "user" (id) ON UPDATE CASCADE ON DELETE RESTRICT; ALTER TABLE reaction ADD CONSTRAINT tweet_fkey FOREIGN KEY (tweet) REFERENCES tweet (id) ON UPDATE CASCADE ON DELETE RESTRICT; ALTER TABLE reaction DROP COLUMN id; ALTER TABLE reaction ADD CONSTRAINT pk_user PRIMARY KEY ("user",tweet); ALTER TABLE share ADD CONSTRAINT tweet_fkey FOREIGN KEY (tweet) REFERENCES tweet (id) ON UPDATE CASCADE ON DELETE RESTRICT; ALTER TABLE share ADD CONSTRAINT user_fkey FOREIGN KEY ("user") REFERENCES "user" (id) ON UPDATE CASCADE ON DELETE RESTRICT; ALTER TABLE group_users__user_groups ADD CONSTRAINT user_groups_fkey FOREIGN KEY (user_groups) REFERENCES "user" (id) ON UPDATE CASCADE ON DELETE RESTRICT; ALTER TABLE group_users__user_groups ADD CONSTRAINT group_users_fkey FOREIGN KEY (group_users) REFERENCES "group" ("relativeId") ON UPDATE CASCADE ON DELETE RESTRICT;';
		User.query(sql, function(err,tweets){
			if (err) { return res.negotiate("create_fk_1:" + err); }
			else return res.json({success: 'true'});
		});
	}
};

