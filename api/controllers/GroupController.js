/**
 * GroupController
 *
 * @description :: Server-side logic for managing groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	//funcao auxiliar soh para criar os grupos
	create_groups: function(req, res) {
		var groups = [
			{
				'id': 1,
				'name': 'Vila'
			},
			{
				'id': 2,
				'name': 'CAASO'
			},
			{
				'id': 2,
				'name': 'BCC-ICMC'
			}
		];

		Group.create(groups).exec(function callback(error, users_created) {
			if(error)
				console.log("Error while creating groups...");
			else 
				console.log("Groups created successfully..");

			return res.json(users_created);
		});
	},

	//funcao auxiliar soh para inserir os usuarios
	joins_groups: function(req,res){
		
		Group.findOne({'id':3, 'name': 'Turminha'}).populate('users').exec(function outer_callback(err, found_group){
			if(err){
				return res.negotiate(err);
			}
			if (!found_group){
				return res.negotiate("Nao achou o grupo");
			}
			else{
				found_group.users.add(3);

				found_group.save(function inner_callback(err){
					if(err){
						return res.negotiate("Nao achou o grupo");
					}
				});

				console.log("Usuario adiciona com sucesso");
			}
		});
		
		Group.findOne({'id':3, 'name': 'Turminha2'}).populate('users').exec(function callback(err, found_group){
			if(err){
				return res.negotiate(err);
			}
			if (!found_group){
				return res.negotiate("Nao achou o grupo");
			}
			else{
				found_group.users.add(3);
				found_group.save(function inner_callback(err){
					if(err){
						return res.negotiate("Nao achou o grupo");
					}
				});
				console.log("Usuario adiciona com sucesso");
			}
		});

		Group.findOne({'id':3, 'name': 'Turminha3'}).populate('users').exec(function callback(err, found_group){
			if(err){
				return res.negotiate(err);
			}
			if (!found_group){
				return res.negotiate("Nao achou o grupo");
			}
			else{
				found_group.users.add(3);
				found_group.save(function inner_callback(err){
					if(err){
						return res.negotiate("Nao achou o grupo");
					}
				});
				console.log("Usuario adiciona com sucesso");
			}
		});

		return 0;
	},

	get_members: function(req,res){
		var id_group = req.param('id_group');


		var select = 'SELECT "user".login, "user".id FROM "user" INNER JOIN group_users__user_groups ON group_users__user_groups.group_users = "user".id WHERE group_users__user_groups.user_groups = '+id_group;
		/*
		SELECT "user".login, "user".id
		FROM "user"
		INNER JOIN group_users__user_groups
			ON group_users__user_groups.group_users = "user".id
		WHERE group_users__user_groups.user_groups = '+id_group
		*/

		console.log("(1)id_group: " + id_group);
		console.log(select);

		Group.query(select, function(err,members){
			if (err) return res.negotiate("1:" + err);
			else{
				console.log(members.rows);
				return res.json(members.rows);
			}
		});
	},

	get_master: function(req,res){
		var id_group = req.param('id_group');

		console.log("(2)id_group: " + id_group);
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
		var group_name = req.param('group_name');

		//procura para saber se o usuario jah possui um grupo com esse nome
		Group.findOne({'id':id_user, 'name': group_name}).exec(function callback(err, found_user){
			if (err) return res.negotiate(err);
  			if (!found_user){ //se nao tiver entao cria um grupo novo
  				Group.create({'id':id_user, 'name': group_name}).exec(function callback(error, group_created) {
					if(error) console.log(error);
					else{
						console.log("banco criado com sucesso");
						return res.json(group_created);
					}
				});
			}
		});
	},

	join_member: function(req,res){
		var id_user = req.param('id_user');
		var group_id = req.param('group_id');

		group = {'relativeId': group_id};

		Group.findOne(group).populate('users').exec(function callback(err, found_group){
			if(err) return res.negotiate(err);
			if (!found_group) return res.negotiate("Nao achou o grupo");
			else{
				found_group.users.add(id_user);

				found_group.save(function callback(err){
					if(err){
						return res.negotiate("Nao achou o grupo");
					}
					else
						console.log("Usuario adiciona com sucesso");
				});
			}
		});
	},
};
