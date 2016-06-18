/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create_users: function(req, res) {
		var users = [
			{
				'name': 'Emanuel Valente',
				'login': 'emanuel',
				'password': 'emapass',
				'birthday': '1900-12-27T00:00:00Z',
				'bio': "ema bio",
				'email': 'emanuelvalente@gmail.com'
			},
			{
				'name': 'Leonardo Miguel',
				'login': 'leonardo',
				'password': 'leopass',
				'birthday': '1920-12-27T00:00:00Z',
				'bio': "leo bio",
				'email': 'leonardomiguel@gmail.com'
			},
			{
				'name': 'Cláudio Domene',
				'login': 'claudio',
				'password': 'claudiopass',
				'birthday': '1950-12-27T00:00:00Z',
				'bio': "claudio bio",
				'email': 'claudiodomene@gmail.com'
			}
		];

		User.create(users).exec(function callback(error, users_created) {
			if(error) {
				console.log("Error while creating users...");
			}

			console.log("Users created successfully..");

			return res.json(users_created);
		})
	},
	
	login: function(req, res) {
		var user = req.param('user') || undefined;
		var pass = req.param('password') || undefined;

		sails.log("user and pass " + user + ' '+ pass);
	
		if(user && pass) {
		User.findOne({login:user})
			.exec(function (err, found_user){
  				if (err) {
    				return res.negotiate(err);
  				}

 				if (!found_user)
    				return res.negotiate('Could not find user ' +  user + ' sorry.');
  				else {
  					if(found_user.password == pass) {
	  					sails.log("user " + user + " is authenticated");
	  					return res.json(found_user);
  					}
  					else
  						return res.negotiate("password incorrect for user " + user);
  				}
			});
		} else {
			return res.negotiate();
		}
	},

	create_user: function(req, res) {
		var params = req.params.all();
		var params = req.query;

		var user_content = {
		 name: req.param('firstname') || undefined,
         login: req.param('login')  || undefined,
         password: req.param('password') || undefined,
         bio: req.param('description') || undefined,
         email: req.param('email') || undefined,
         gender: req.param('gender') || undefined
		};

		var tmpDate = req.param('birthmonth') + "/" + req.param('birthday') + "/" + req.param('birthyear');
		console.log("tmpDate: " + tmpDate);
		user_content['birthday'] = new Date(tmpDate);
		
		console.log("Printing request");
		console.log("name: " + user_content['name']);
		console.log("login: " + user_content['login']);
		console.log("password: " + user_content['password']);
		console.log("birthday: " + user_content['birthday']);
		console.log("bio: " + user_content['bio']);
		console.log("email: " + user_content['email']);
		console.log("gender: " + user_content['gender']);

		if(user_content['name'] != undefined && user_content['login'] != undefined &&
		   user_content['password'] != undefined && user_content['birthday'] != undefined &&
		   user_content['bio'] != undefined && user_content['email'] != undefined && 
		   user_content['gender'] != undefined) {

			User.create(user_content).exec(function callback(error, users_created) {
				if(error) {
					console.log("Error while creating users...");
					console.log(error);
					return res.json({was_created: 'false'});
				}

				console.log("User created successfully..");

				return res.json(users_created);
			})
		}
		else
			return res.json({was_created: 'missing fields'});
	},

	create_user_debug: function(req, res) {
		//var params = req.params.all();
		//var params = req.query;

		var user_content = {
		 nome: req.param('name') || undefined,
         login: req.param('user')  || undefined,
         password: req.param('password') || undefined,
         bio: req.param('description') || undefined,
         email: req.param('email') || undefined
		};

		var tmpDate = req.param('birthmonth') + "/" + req.param('birthday') + "/" + req.param('birthyear');
		user_content['birthday'] = new Date(tmpDate);
		
		console.log("Printing request");
		console.log("nome: " + user_content['nome']);
		console.log("login: " + user_content['login']);
		console.log("password: " + user_content['password']);
		console.log("birthday: " + user_content['birthday']);
		console.log("bio: " + user_content['bio']);
		console.log("email: " + user_content['email']);
	},

	delete_user: function(req,res){
		var id_user = req.param('id_user');

		//deleta os membros de todos os grupos que o usuario eh o master

		//encontra os grupos q o usuario eh master
		Group.find({id:id_user}).exec(function callback(err, found){
			if(err) {return res.negotiate('8:'+err);}
			var i;
			for(i = 0; i < found.length; i++){
				select = 'DELETE FROM group_users__user_groups WHERE group_users = '+found[i].relativeId;
				Group.query(select, function(err,results){
		  			if(err) return res.serverError(err);
				});
			}
		});

		Follow.destroy({follower:id_user}).exec(function(err){
			if (err) {return res.negotiate('7:'+err);}
			Follow.destroy({follows:id_user}).exec(function(err){
				if (err) {return res.negotiate('6:'+err);}
				Reaction.destroy({user:id_user}).exec(function(err){
					if (err) {return res.negotiate('5:'+err);}
					Share.destroy({user:id_user}).exec(function(err){
					if (err) {return res.negotiate('4:'+err);}
						Group.destroy({id:id_user}).exec(function(err){
						if (err) {return res.negotiate('3:'+err);}
							Tweet.destroy({user:id_user}).exec(function(err){
								if (err) {return res.negotiate('2:'+err);}
								User.destroy({id:id_user}).exec(function (err){
								  	if (err) {return res.negotiate('1:'+err);}
									return res.json({success: 'true'});
								});
							});
						});
					});
				});
			});
		});
	},

	get_data: function(req,res){
		var id_user = req.param('id_user')  || undefined;
		//console.log("get_data: id_user -> " + id_user );

		User.findOne({'id':id_user}).exec(function (err, found_user){
			if (err) {
    			return res.negotiate(err);
  			}
  			if(!found_user)
  				return res.json({success: 'false'});
  			else {
  				found_user.success = 'true';
  				return res.json(found_user);
  			}
		});
	},

	alter_data: function(req,res){
		var user = {
			id: req.param('id') || undefined,
			name: req.param('name') || undefined,
			gender: req.param('gender') || undefined,
			email: req.param('email') || undefined,
			bio: req.param('bio') || undefined,
		};

		var tmpDate = req.param('birthmonth') + "/" + req.param('birthday') + "/" + req.param('birthyear');
		user['birthday'] = new Date(tmpDate);
		var timestamp = user['birthday'].toJSON();

		User.update({id:user.id},{name: user.name, birthday:user.birthday, bio: user.bio, email: user.email, gender:user.gender}).exec(function afterwards(err, updated){
		  if (err) { return res.negotiate(err);}
		  else{
		  	return res.json({success: 'true'});
		  }
		});
	},

	alter_password: function(req,res){
		var id_user = req.param('id');
		var password_user = req.param('newpassword');

		User.update({id:id_user}, {password: password_user}).exec(function afterwards(err, updated){
		  if (err) { return res.negotiate(err);}
		  else{
		  	return res.json({success: 'true'});
		  }
		});
	},

	find_user: function(req,res){
		var login_user = req.param('login_user');


		User.findOne({'login':login_user}).exec(function callback(err, found_user){
			if (err) return res.negotiate("find_user_1: "+err);
  			else if(!found_user) return res.json({success: 'false'});
  			else {
  				found_user.success = 'true';
  				return res.json(found_user);
  			}
		});
	},

	find_user_using_string: function(req,res){
		var name_user = req.param('name_user');

		select = 'SELECT name, id, login FROM "user" WHERE name ILIKE \'%'+name_user+'%\'';

		Group.query(select, function(err,users){
			if (err) return res.negotiate("1:" + err);
			else{
				console.log(users.rows);
				return res.json(users.rows);
			}
		});
	},

	get_groups: function(req,res){
		var id_user = req.param('id_user');

		User.findOne({'id':id_user}).populate('groups').exec(function callback(err, found_user){
			if (err) {
    			return res.negotiate(err);
  			}
  			else {
  				return res.json(found_user.groups);
  			}
		});
	}

};

