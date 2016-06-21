/*
-------------------- GROUP CONTROLLER --------------------
Controlador para grupos

Metodos:
    find_groups_and_masters: busca os grupos com o mesmo no e os seus respectivos dono (usado para buscas)
    get_members: busca os membros do grupo
    get_master: busca o dono do grupo
    create_group: cria um grupo
    join_member: invita um membro no grupo
    delete_member: deleta um membro
    delete_group: deleta o grupo
	get_tweets: busca os tweets para o grupo
*/

module.exports = {

	find_groups_and_masters: function(req,res){
		var name_group = req.param('name_group');

		var select = 'SELECT "group".name, "user".login FROM "group" INNER JOIN "user" ON "user".id = "group".id WHERE "group".name = \''+name_group+'\'';
		/*
		SELECT "group".name, "user".login
		FROM "group"
		INNER JOIN "user" ON "user".id = "group".id
		WHERE "group".name = '+name_group+';
		*/
		Group.query(select, function(err,groups){
			if (err) return res.negotiate("1:" + err);
			else{
				return res.json(groups.rows);
			}
		});
	},

	get_members: function(req,res){
		var id_group = req.param('id_group');


		var select = 'SELECT "user".login, "user".id FROM "user" INNER JOIN group_users__user_groups ON group_users__user_groups.user_groups = "user".id WHERE group_users__user_groups.group_users = '+id_group;
		/*
		SELECT "user".login, "user".id
		FROM "user"
		INNER JOIN group_users__user_groups
			ON group_users__user_groups.users_group = "user".id
		WHERE group_users__user_groups.group_users = '+id_group
		*/

		Group.query(select, function(err,members){
			if (err) return res.negotiate("1:" + err);
			else{
				return res.json(members.rows);
			}
		});
	},

	get_master: function(req,res){
		var id_group = req.param('id_group');

		Group.findOne({'relativeId': id_group}).exec(function callback(err, found){
			if(err) return res.negotiate(err);
			if (!found) return res.negotiate("Nao achou o grupo");
			else{
				User.findOne({'id': found.id}).exec(function callback(err, found){
					return res.json({'id': found.id, 'name': found.name})
				});
			}
		});
	},

	create_group: function(req, res){
		var id_user = req.param('id_user');
		var name_group = req.param('name_group');

		//procura para saber se o usuario jah possui um grupo com esse nome
		Group.findOne({'id':id_user, 'name': name_group}).exec(function callback(err, found_user){
			if (err) return res.negotiate(err);

  			if (!found_user){ //se nao tiver entao cria um grupo novo
  				group = {'id': id_user,'name': name_group};

    			Group.create(group).exec(function callback(err, group_created) {
					if (err) return res.negotiate(err);
					else{
						console.log("Grupo criado com sucesso.");
						return res.json(group_created);
					}
				});
			}
		});
	},

	join_member: function(req, res) { 
		var id_user = req.param('id_user');
		var id_group = req.param('id_group');

		select = 'SELECT * FROM group_users__user_groups WHERE user_groups = '+id_user+' AND group_users = '+id_group;
		/*
		SELECT * FROM
		group_users__user_groups
		WHERE user_groups = '+id_user+' AND group_users = '+id_group
		*/

		//verifica se o usuario ja nao esta no grupo
		Group.query(select,function(err,results){
			//erro
			if(err) return res.negotiate("1: "+err);

			//caso o usuario ainda n esteja, insere
			if(results.rowCount == 0){

				select = 'INSERT INTO "group_users__user_groups" (group_users, user_groups) values (\'' + id_group + '\', \'' + id_user + '\');';
				/*
					INSERT INTO "group_users__user_groups" (group_users, user_groups)
					VALUES ('+group_id+', '+id_user+' )
				*/
				Group.query(select, function(err,results){
  					if(err) return res.serverError(err);
  					console.log("usuario inserido no grupo com sucesso!");
  					return res.json({'success': true});
				});
			}
			else
				return res.json({'success': false});
		});
	},


	delete_member: function(req, res) { 
		var id_user = req.param('id_user');
		var id_group = req.param('id_group');


		select = 'SELECT * FROM group_users__user_groups WHERE user_groups = '+id_user+' AND group_users = '+id_group;
		/*
		SELECT * FROM
		group_users__user_groups
		WHERE user_groups = '+id_user+' AND group_users = '+id_group
		*/

		//verifica se o usuario esta no grupo
		Group.query(select,function(err,results){

			//erro
			if(err) return res.negotiate("1: "+err);

			if(results.rowCount == 0)
					return res.json({'success': false});
			else{
				select = 'DELETE FROM group_users__user_groups WHERE user_groups = '+id_user+' AND group_users = '+id_group;
				/*
					DELETE FROM group_users__user_groups
					WHERE user_groups = '+id_user+' AND group_users = '+id_group
				*/
				Group.query(select, function(err,results){
  					if(err) return res.serverError(err);
  					console.log("usuario deletado do grupo com sucesso!");
  					return res.json({'success': true});
				});
			}
		});
	},

	delete_group: function(req, res) { 
		var id_group = req.param('id_group');

		select = 'DELETE FROM group_users__user_groups WHERE group_users = '+id_group;

		Group.query(select, function(err,results){
  			if(err) return res.serverError(err);

  			select = 'DELETE FROM "group" WHERE "relativeId" = '+id_group;
  			Group.query(select, function(err,results){
  				if(err) return res.serverError(err);
  				console.log("grupo deletado com sucesso!");
  				return res.json({'success': true});
  			});
		});
	},

	get_tweets: function(req,res){
		id_group = '9';
		name_group = 'gClaudio';
		//id_group = req.param('id_group');
		//name_group = req.param('name_group');

		tweetsList = [];

		sql = 'SELECT "user".name, tweet.id, tweet.title, tweet.text, tweet.timestamp FROM tweet INNER JOIN "user" ON "user".id = tweet.user';
		Group.query(sql, function(err,tweets){
			if(err) return res.serverError("get_tweets_1: "+err);

			for(i = 0; i < tweets.rowCount; i++){
				text = tweets.rows[i].text;

				function urlifyGroups(text) {
					var urlRegex = /(\@[^\s]+)/g;
					return text.replace(urlRegex, function(url) {
						if(url == ('@'+name_group)){
							
							serverService.divide_timestamp(tweets.rows[i].timestamp, "", function(result){
								tweets.rows[i].year = result.year;
								tweets.rows[i].month = result.month;
								tweets.rows[i].day = result.day;
								tweets.rows[i].hour = result.hour;
								tweets.rows[i].minute = result.minute;

								tweetsList.push(tweets.rows[i]);
							});

							tweetsList.push(tweets.rows[i]);
						}
			    		//return url;
		    		})
				};

				urlifyGroups(text);
			}

			return res.json(tweetsList);
		});
	}
};
