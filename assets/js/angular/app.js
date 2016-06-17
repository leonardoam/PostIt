
	var myApp = angular.module('App',  ['ngRoute', 'ngSanitize']);
		
	//retorna um objeto "template" para os controllers e o ng-model trabalharem
	// Os dados são definidos no serviço, assim, mais controladores interessados
    //	nos dados tem somente que declarar/registrar o serviço -> modularização.


//ROTAS ------------------------------------------------------------------------------------------
	myApp.config(['$routeProvider', '$locationProvider',
	   function($routeProvider, $locationProvider){
		    $routeProvider.
		    when('/',{
				templateUrl: 'templates/index.html',
			}).
		    when('/signup',{
			  	templateUrl: 'templates/signup.html',
			}).
		    when('/content',{
			  	templateUrl: 'templates/content.html',
			}).
		    when('/groups:groupParam',{
			  	templateUrl: 'templates/groups.html',
			}).
			when('/profile:id_user',{
			  	templateUrl: 'templates/profile.html',
			}).
			when('/statistic',{
			  	templateUrl: 'templates/statistic.html',
			}).
			when('/config',{
			  	templateUrl: 'templates/profileconfig.html',
			}).
		    otherwise({
		   		redirectTo: '/'
			});
	    }
	]);

//SERVICOS ------------------------------------------------------------------------------------------
	myApp.factory('Service', function ($http) {
		return { 
			'post': function(controller, method, data){
				return $http.post('/' + controller + '/' + method, data);
			},

			'get': function(controller, method, data){
				return $http.get('/' + controller + '/' + method, data);
			},

			'get_auth': function(){
				return localStorage.getItem("auth");
			},

			'set_auth': function(value){
				localStorage.setItem("auth", value);
			},

			'get_user': function(){
				return localStorage.getItem("id");
			},
				
			'set_user': function(data){
				localStorage.setItem("id", data);
			}
		}
	});

//VALIDACAO DE FORMULARIO ------------------------------------------------------------------------------------------
	myApp.factory('Validacao', function(Service) {
		var letras = /^[A-Za-z]+$/;
        var letrasComEspaco = /^[A-Za-z ]+$/;
    	var numeros = /^[0-9]+$/;

		return {
			'firstname': function(firstname){
				if(firstname == undefined || firstname == ""){
    				alert("Preencha o campo nome!");
    				return 0;
    			}
    			if(firstname.length > 10){
    				alert("Campo nome deve conter até 10 letras!");
    				return 0;
    			}
    			if(!firstname.match(letrasComEspaco)){
    				alert("O campo nome deve conter apenas letras.");
      				return 0;
    			}
    			return 1;
			},

			'lastname': function(lastname){
				if(lastname == undefined || lastname == ""){
	    			alert("Preencha o campo sobrenome!");
	    			return 0;
	    		}
	    		if(lastname.length > 10){
	    			alert("Campo sobrenome deve conter até 10 letras!");
	    			return 0;
	    		}
	    		if(!lastname.match(letrasComEspaco)){
	    			alert("O campo sobrenome deve conter apenas letras.");
	      			return 0;
	    		}
	    		return 1;
			},

			'name': function(name){
				if(name == undefined || name == ""){
	    			alert("Preencha o campo nome!");
	    			return 0;
	    		}
	    		if(name.length > 20){
	    			alert("Campo nome deve conter até 20 letras!");
	    			return 0;
	    		}
	    		if(!name.match(letrasComEspaco)){
	    			alert("O campo nome deve conter apenas letras.");
	      			return 0;
	    		}
	    		return 1;
			},

			'email': function(email){
	    		if(email == undefined || email == ""){
	    			alert("Preencha o campo de e-mail.");
	    			return false;
	    		}
	 			var erro = 0;
	 			var emailaux = email;
			    emailaux = emailaux.split("@");
			    if(emailaux.length != 2 || emailaux[0] < 1){ //verifica se o email exite duas partes, uma antes de @ e outra depois
			        erro = 1;
			        alert("Formato de e-mail incorreto. O e-mail deve ter o formato example@example.com");
			        return false;
			    }            
			    else{   //verifica se a segunda parte esta correta
			    	var a = emailaux[1].split(".");                    
			    	if(a.length != 2) erro = 1;
			    	else if( a[0] < 3 || a[1] != "com") erro = 1;
			    }
			    if(erro){
			    	alert("Formato de e-mail incorreto. O e-mail deve ter o formato example@example.com");
			      	return false;
			    }
			    return true;
			},

			'login': function(login){
	    		if(login == undefined || login == ""){
	    			alert("Preencha o campo de login.");
	    			return false;
	    		}
	    		if(!login.match(letras)){
	    			alert("O login deve ter apenas letras");
	      			return false;
	    		}
	    		Service.post('user','find_user',{'login_user': login}).then(
	    			function(respon){
	    				if(respon.data.success == 'true'){
	    					alert("Login já existe, tente outro...");
	    					return false;
	    				}
	    			}
	    		);
	    		return true;
			},
			
			'password': function(password,passwordConfirm){
	    		if(password == undefined || passwordConfirm == undefined || password == "" || passwordConfirm == ""){
	    			alert("Preencha os campos de password.");
	    			return false;
	    		}
	    		if(password != passwordConfirm){
	    			alert("Os campos de senha estão diferentes.");
	    			return false;
	    		}
    			return true;
			},
			
			'bio': function(bio){
	    		if(bio == undefined || bio == ""){
	    			alert("Escreva uma descrição.");
	    			return false;
	    		}
	    		if(bio.length > 200){
	    			alert("Descrição muito grande! Máximo de 200 letras");
	    			return false;
	    		}
	    		return true;
			},
		}
	});

//SIGNUP ------------------------------------------------------------------------------------------
	myApp.controller('signup-controller', function ($scope, Service, $location, Validacao) {
		$scope.user = {};

		$scope.createUser = function(user) {
        	$scope.user = angular.copy(user);

        	var letras = /^[A-Za-z]+$/;
        	var letrasComEspaco = /^[A-Za-z ]+$/;
    		var numeros = /^[0-9]+$/;

    		//validacao do formulario
    		if(!Validacao.firstname(user.firstname)) return 0;
    		if(!Validacao.lastname(user.lastname)) return 0;
    		if(!Validacao.email(user.email)) return 0;
    		if(!Validacao.login(user.login)) return 0;
    		if(!Validacao.password(user.password,user.passwordConfirm)) return 0;
    		if(!Validacao.bio(user.description)) return 0;

        	Service.post('user','create_user',user);
        	alert("Usuário " + user.login + " criado com sucesso!");
        	$location.path('/');
        };
	});

//LOGIN ------------------------------------------------------------------------------------------
	myApp.controller('login-controller', function ($scope, $location, Service) {

		$scope.auth = Service.get_auth();
		$scope.userId = Service.get_user();

		$scope.login = function(login_data) {
        	var auth_data = angular.copy(login_data);

      		Service.post('user','login',auth_data).then(
				function(respon){	//SUCESSO
					Service.set_user(respon.data.id);
					Service.set_auth(true);
					location.reload();
				},

				function(respon){	//FALHA
					alert("Nome de usuário ou senha incorretos!");
				}
			);
      	}

      	$scope.logout = function(){
      		Service.set_auth(false);
      		Service.set_user(0);
      		location.reload();
      	}

      	$scope.goPage = function(local){
      		if(local == 'profile')
      			$location.path('/profile:' + Service.get_user());
      		else
      			$location.path('/' + local);
      	}
	});

//GROUP ------------------------------------------------------------------------------------------
	myApp.controller('group-controller', function ($scope, Service,$location,$routeParams) {

		$scope.dataGroup = function(){
			var x = $routeParams.groupParam.split(':');
			$scope.id_group = x[1];
			$scope.name_group = x[2];

			Service.post('group','get_members',{'id_group': $scope.id_group}).then(
				function(respon){
					$scope.members = respon.data;
					$scope.membersNumber = respon.data.length; 
				},
				function(respon){}
			);

			Service.post('group','get_master',{'id_group': $scope.id_group}).then(
				function(respon){
					$scope.master = respon.data;
					$scope.userId = Service.get_user();
				},
				function(respon){}
			);
		}

		$scope.createGroup = function(user) {
			var id_user = Service.get_user();
			var group_data = {'id_user': id_user, 'name_group': $scope.groupName};
			
			$scope.groupName = "";

			//cria o grupo
        	Service.post('group','create_group',group_data).then(
				function(respon){	//SUCESSO
					group_data = {'id_user': id_user, 'id_group': respon.data.relativeId};
					Service.post('group','join_member', group_data);
					$scope.getUserData();
				},

				function(respon){	//FALHA
					alert("falha ao tentar criar um grupo!");
				}
			);//then
    	}

    	$scope.deleteGroup = function(){
    		var id = {'id_group': $scope.id_group};

    		Service.post('group','delete_group',id).then(
    			function(respon){
					$location.path('/content');
					alert("grupo deletado. :(");
    			},
    			function(respon){}
    		);
        }

        $scope.addMember = function(add_member){
        	console.log($scope.add_member);
        	$scope.add_member = "";

        	Service.post('user','find_user',{'login_user': add_member}).then(
				function(respon){	//SUCESSO
					group_data = {'id_user': respon.data.id, 'id_group': $scope.id_group};

					Service.post('group','join_member', group_data).then(
						function(respon){
							if(respon.data.success){
								$scope.dataGroup();
								alert(add_member+" adicionado ao grupo! :D");

							} else
								alert("Usuário já está no grupo. :/");

						},
						function(respon){
							alert("caraio");
						}
					);
				},

				function(respon){	//FALHA
					alert("Usuário não encontrado. :/ \n Talvez você tenha digitado o nome errado, certifique-se de não incluir @ quando for procurar.");
				}
			);//then
        }

        $scope.deleteMember = function(del_member){
        	$scope.del_member = "";

   			Service.post('user','find_user',{'login_user': del_member}).then(
				function(respon){	//SUCESSO

					if(respon.data.id == Service.get_user())
						alert("Cara, você não pode se excluir do grupo.\nSe você quiser você pode deletar o grupo todo.. é uma opção.")
					else{
						group_data = {'id_user': respon.data.id, 'id_group': $scope.id_group};

						Service.post('group','delete_member', group_data).then(
							function(respon){
								if(respon.data.success){
									$scope.dataGroup();
									alert(del_member+" excluido do grupo com sucesso.");
								} else
									alert("Não existe usuário com esse nome aqui.");
							},
							function(respon){}
						);
					}
				},

				function(respon){	//FALHA
					alert("Não existe usuário com esse nome aqui.");
				}
			);//then
        }

        $scope.leaveGroup = function(){
        	Service.post('group','delete_member', {'id_user': Service.get_user(), 'id_group': $scope.id_group}).then(
        		function(respon){
					if(respon.data.success){
						alert("Você saiu do grupo " + $scope.name_group + " com sucesso. :)");
						$location.path('/content');
					} else
						alert("Não existe usuário com esse nome aqui.");
				},
				function(respon){}
        	);
        }

        $scope.groupSelected = function(group) {
        	$location.path('/groups:' + group.relativeId + ':' + group.name);
        }
	});
	
//USERDATA ------------------------------------------------------------------------------------------
	myApp.controller('userData-controller', function($scope,Service,$rootScope,$location) {

		$rootScope.$on("call-getUserDataMethod", function(){
           $scope.getUserData();
        });

		$scope.getUserData = function(){
			var id_user = {'id_user': Service.get_user()};
			
			//busca os dados do proprio usuario
			Service.post('user','get_data',id_user).then(
				function(respon){ //SUCESSO
					$scope.name = respon.data.name;
					$scope.login = respon.data.login;
				},

				function(respon){ //FALHA
					console.log('erro ao procurar usuario');
				}
			);

			//quem ele segue
			Service.post('follow','get_followers',id_user).then(
				function(respon){
					$scope.followers = respon.data.length;
				},
				function(respon){
					console.log('erro ao procurar seguidores');
				}
			);


			//quem segue ele
			Service.post('follow','get_follows',id_user).then(
				function(respon){
					$scope.follows = respon.data.length;
				},
				function(respon){
					console.log('erro ao procurar seguidores');
				}
			);

			//o numero de postagens feitas pelo usuario
			Service.post('tweet','get_tweets',id_user).then(
				function(respon){
					$scope.tweets = respon.data.length;
				},
				function(respon){
					console.log('erro ao procurar publicacoes');
				}
			);

			//procura os grupos q o usuario esta
			Service.post('user','get_groups',id_user).then(
				function(respon){
					$scope.groupsList = respon.data;
				},
				function(respon){
					console.log('erro ao procurar grupos');
				}
			);
		}

		$scope.goToProfile = function(){
			$location.path('/profile:'+Service.get_user());
		}
	});

//TWEET ------------------------------------------------------------------------------------------
/* Metodos:
	getTweets(): retorna os tweets feitos pelo usuario e por quem ele segue em ordem por hora(timeline)
	createTweets(): cria um novo tweet
*/
	myApp.controller('tweet-controller', function ($scope, Service,$routeParams,$rootScope) {

		$scope.get_tweets = function(){
			var id_user = {'id_user': Service.get_user()};
			$scope.tweetsList = [];

			Service.post('tweet','timeline',id_user).then(
				function(respon){
					
					$scope.tweetsList = respon.data;

					//ordena pela hora
					$scope.tweetsList.sort(function(a,b) { 
    					return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() 
					});
				},
				function(respon){
					console.log('erro ao carregar a timeline');
				}
			);
		}

		$scope.get_userTweets = function(){
			x = $routeParams.id_user.split(':');
			var id_user = {'id_user': x[1]};

			$scope.tweetsList = [];
						
			Service.post('tweet','get_tweets', id_user).then(
				function(respon){
					
					$scope.tweetsList = respon.data;

					//ordena pela hora
					$scope.tweetsList.sort(function(a,b) { 
    					return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() 
					});
				},
				//falha
				function(respon) {
					console.log("falha ao listar tweets!");
				}					
			);			
		}

		$scope.createTweet = function(tweetToPost) {
			var data = {};
        	data = angular.copy(tweetToPost);
        	data['id_user'] = Service.get_user();

        	Service.post('tweet','create_tweet',data).then(
        		function(err){
        			$scope.get_tweets();
        			$rootScope.$emit("call-getUserDataMethod", {});
        		},
        		function(err){
        			alert(" Algum erro ocorreu! Sua mensagem não pode ser enviada! :( ");
        		}
        	);
      	}
	});

//PROFILE ------------------------------------------------------------------------------------------
	myApp.controller('profile-controller', function ($scope, Service,$routeParams,$location) {

		$scope.get_data = function(){
			x = $routeParams.id_user.split(':');
			var id_user = {'id_user': x[1]};

			$scope.userAuth = Service.get_user();
			$scope.userProfile = x[1];

			Service.post('user','get_data',id_user).then(
				function(respon){ //SUCESSO

					if(respon.data.success == 'false'){
						$location.path('/content');
						alert('Perfil de usuário não encontrado!');
					}

					/*fix birthday*/
					respon.data.birthday = respon.data.birthday.split("-");
					respon.data.birthday = respon.data.birthday[2][0] + respon.data.birthday[2][1] + '/' 
						+ respon.data.birthday[1] + '/' + respon.data.birthday[0];
				
					if(respon.data.gender = 'm') respon.data.gender = 'masculino';
					else  respon.data.gender = 'feminino';

					$scope.user = respon.data
					//$scope.login = respon.data.login;
				},

				function(respon){ //FALHA
					console.log(respon);
				}
			);

			//ver se o usuario jah segue o dono do perfil
			Service.post('follow','check_follower',{'id_user': $scope.userAuth, 'id_follow': $scope.userProfile}).then(
				function(respon){
					if(respon.data.success == 'true') $scope.follow = true;
					else $scope.follow = false;

				}
			);
		}

		$scope.follow_user = function(){
			Service.post('follow','follow_user',{'id_user': $scope.userAuth, 'id_follow': $scope.userProfile}).then(
				function(respon){
					if(respon.data.success == 'true') location.reload();
				}
			);
		}

		$scope.unfollow_user = function(){
			Service.post('follow','unfollow_user',{'id_user': $scope.userAuth, 'id_follow': $scope.userProfile}).then(
				function(respon){
					if(respon.data.success == 'true') location.reload();
				}
			);
		}
	});


//CONFIG ------------------------------------------------------------------------------------------
	myApp.controller('config-controller', function ($scope, Service,$location,Validacao) {
		
		$scope.user = {};

		Service.post('user','get_data',{'id_user': Service.get_user()}).then(
			function(respon){
				$scope.user = respon.data;

				var birthday = respon.data.birthday.split('-');
				$scope.user.birthyear = birthday[0];
				$scope.user.birthmonth = birthday[1];
				birthday = birthday[2].split('T');
				$scope.user.birthday = birthday[0];
			}
		);

		$scope.alter_data = function(){

			//validacao do formulario
    		if(!Validacao.name($scope.user.name)) return 0;
    		if(!Validacao.email($scope.user.email)) return 0;
    		if(!Validacao.bio($scope.user.bio)) return 0;

			Service.post('user','alter_data',$scope.user).then(
				function(respon){
					alert("Alterações salvas.");
					location.reload();
				}
			);
		}

		$scope.alter_password = function(){
			//validacao da senha
			if(!Validacao.password($scope.user.newpassword,$scope.user.newpasswordConfirm)) return 0;

			Service.post('user','alter_password',$scope.user).then(
				function(respon){
					alert("Senha alterada com sucesso.");
					location.reload();
				}
			);
		}

		$scope.delete_user = function(){
			id_user = Service.get_user();

			Service.post('user','delete_user',{'id_user': id_user}).then(
				function(respon){
					alert("Conta deletada com sucesso.");
					Service.set_auth(false);
      				Service.set_user(0);
      				location.reload();
				}
			);
		}

	});

//SEARCH ------------------------------------------------------------------------------------------
	myApp.controller('search-controller', function ($scope, Service,$location,Validacao) {
		
		$scope.Search = function(){
			var search = $scope.search;

			if(search == "" || search == undefined){
				$scope.search == "";
				return 0;
			}


			Service.post('user','alter_data',$scope.user).then(
				function(respon){
					alert("Alterações salvas.");
					location.reload();
				}
			);
		}

	});