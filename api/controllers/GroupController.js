/**
 * GroupController
 *
 * @description :: Server-side logic for managing groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



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
			if(err)
				return res.negotiate(err);
			if (!found)
				return res.negotiate("Nao achou o grupo");
			else
				return res.json(found.id);
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

    			Group.create(group).exec(function callback(error, group_created) {
					if(error) 
						console.log(error);
					else{
						console.log("Groups created successfully..");
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
};
