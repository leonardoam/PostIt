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

	create_group: function(req, res){
		var id_user = req.param('id_user');
		var group_name = req.param('group_name');

		//procura para saber se o usuario jah possui um grupo com esse nome
		Group.findOne({'id':id_user, 'name': group_name}).exec(function callback(err, found_user){
			if (err) return res.negotiate(err);

  			if (!found_user){ //se nao tiver entao cria um grupo novo
  				group = {'id': id_user,'name': group_name};

    			Group.create(group).exec(function callback(error, group_created) {
					if(error) 
						console.log(error);
					else{
						console.log("Groups created successfully..");
						return res.json({was_created: true} );
					}
				});
			}
		});
	},



	join_group: function(req, res) { 
		var id_user = req.param('id_user');
		var group_name = req.param('group_name');
		var group_id;

		//busca id do grupo pelo nome
		Group.query('select "group"."relativeId" from "group" where "group"."name" = \'' + group_name + '\';',
			 function(err, results) {
  			if (err) return res.serverError(err);
  				group_id = results.rows[0]['relativeId'];
  				//console.log("vou inserir no grupo com id: " + group_id);
  				//insere usuario no grupo pelo id do grupo que acabou de buscar
  				Group.query('insert into "group_users__user_groups" (group_users, user_groups) values (\'' + group_id + '\', \'' + id_user + '\');',
  					function(err, results) {
  						if(err) return res.serverError(err);
  						console.log("usuario inserido no grupo com sucesso!");
  						res.json({was_inserted: true});
  					});
		});

	
	},



     //ANTIGA
	/*join_group: function(req,res){
		var id_master = req.param('id_master');
		var id_user = req.param('id_user');
		var group_name = req.param('group_name');

		group = {'id':id_master, 'name': group_name};

		Group.findOne(group).populate('users').exec(function callback(err, found_group){
			if(err){
				return res.negotiate(err);
			}
			if (!found_group){
				return res.negotiate("Nao achou o grupo");
			}
			else{
				found_group.users.add(group.id);

				found_group.save(function callback(err){
					if(err){
						return res.negotiate("Nao achou o grupo");
					}
					else
						console.log("Usuario adiciona com sucesso");
				});
			}
		});
	},*/
};

