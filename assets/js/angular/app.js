
	var myApp = angular.module('App',  ['ngRoute']);
		
	//retorna um objeto "template" para os controllers e o ng-model trabalharem
	// Os dados são definidos no serviço, assim, mais controladores interessados
    //	nos dados tem somente que declarar/registrar o serviço -> modularização.

	myApp.config(['$routeProvider', '$locationProvider',
	   function($routeProvider, $locationProvider){
		    $routeProvider.
		    when('/',{
				templateUrl: 'templates/index.html',
			    controller: 'login-controller'
			}).
		    when('/signup',{
			  	templateUrl: 'templates/signup.html',
			  	controller: 'signup-controller'
			}).
		    when('/content',{
			  	templateUrl: 'templates/content.html',
			  	controller: 'login-controller'
			}).
		    when('/groups:groupParam',{
			  	templateUrl: 'templates/groups.html',
			  	controller: 'login-controller',
			}).
			when('/profile',{
			  	templateUrl: 'templates/profile.html',
			  	controller: 'profile-controller'
			}).
			when('/statistic',{
			  	templateUrl: 'templates/statistic.html',
			  	controller: 'c2'
			}).
		    otherwise({
		   		redirectTo: '/'
			});
	    }
	]);
	
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

	//CONTROLADOR PARA CRIACAO DE USUARIOS
	myApp.controller('signup-controller', function ($scope, Service, $location) {
		$scope.master = {};

		$scope.createUser = function(user) {
        	$scope.master = angular.copy(user);
        	Service.post('user','create_user',$scope.master);
        	alert("Usuário " + $scope.master.user + " criado com sucesso!");
        	$location.path('/#');
        };
	});

	//CONTROLADOR PARA AUTENTICACAO
	myApp.controller('login-controller', function ($scope, $location, Service) {

		$scope.auth = Service.get_auth();
		$scope.userId = Service.get_user();

		$scope.login = function(login_data) {
        	var auth_data = angular.copy(login_data);

      		Service.post('user','login',auth_data).then(
				function(respon){	//SUCESSO
					Service.set_user(respon.data.id);
					Service.set_auth(true);
					$location.path('/content');
				},

				function(respon){	//FALHA
					alert("Nome de usuário ou senha incorreto!");
				}
			);
      	};

      	$scope.logout = function(){
      		Service.set_auth(false);
      		Service.set_user(0);
      		$location.path('/');
      	}

      	$scope.goPage = function(local){
      		$location.path('/' + local);
      	}
	});

	//CONTROLADOR PARA GRUPOS
	myApp.controller('group-controller', function ($scope, Service,$location,$routeParams) {

		$scope.group_data = function(){
			var x = $routeParams.groupParam.split(':');
			var id_group = x[1];
			$scope.name_group = x[2];



			Service.post('group','get_members',{'id_group': id_group}).then(
				function(respon){
					$scope.members = respon.data;
					$scope.membersNumber = respon.data.length; 
				},
				function(respon){}
			);

			Service.post('group','get_master',{'id_group': id_group}).then(
				function(respon){
					$scope.master = respon.data;
				},
				function(respon){}
			);
		}

		$scope.createGroup = function(user) {
			var group_data = {'id_user': Service.get_user(), 'group_name': $scope.groupName};

			Service.post('group','create_group',group_data).then(
				function(respon){
					Service.post('group','join_member',{'id_user': Service.get_user(), 'group_name': respon.data.relativeId});
				},
				function(respon){}
			);

        }

        $scope.addMember = function(){
			var x = $routeParams.groupParam.split(':');
			var id_group = x[1];
			var name_group = x[2];


        	//primeiro verifica se o usuario existe
        	Service.post('user','find_user',{'login_user': $scope.addMember}).then(
        		function(respon){
        			
		        	var user_data = {
		        		'id_user': respon.data.id,
		        		'group_id': id_group
		        	};

        			Service.post('group','join_member',user_data);

        		},
        		function(respon){ alert("Usuario não existe!"); }
        	);
        }

        $scope.deleteMember = function(){

        }

        $scope.deleteGroup = function(){

        }

        $scope.leaveGroup = function(){

        }

        $scope.groupSelected = function(group) {
        	$location.path('/groups:' + group.relativeId + ':' + group.name);
        }
	});
	
	//CONTROLADOR PARA BUSCAR OS DADOS DO USUARIO LOGADO
	myApp.controller('userData-controller', function($scope,Service) {

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
	});

	//CONTROLADOR DAS POSTAGENS (TWEETS)
	myApp.controller('tweet-controller', function ($scope, Service) {
		$scope.master = {};
		$scope.tweetsList = [];


		//encontrar os tweets para a timeline
		$scope.get_tweets = function(){
			var id_user = {'id_user': Service.get_user()};

			Service.post('tweet','timeline',id_user).then(
				function(respon){
					$scope.tweetsList = respon.data;

					//ordena a lista
					$scope.tweetsList.sort(function(a,b) { 
    					return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() 
					});
				},
				function(respon){
					console.log('erro ao carregar a timeline');
				}
			);
		};

		$scope.createTweet = function(tweetToPost) {
        	$scope.master = angular.copy(tweetToPost);
        	$scope.master['id_user'] = Service.get_user();

        	Service.post('tweet','create_tweet',$scope.master).then(
        		function(err){
        			$scope.get_tweets();
        			$scope.getUserData();
        		},
        		function(err){}
        	);
      	};
	});

	//CONTROLADOR DO PROFILE
	myApp.controller('profile-controller', function ($scope, Service) {

		/*busca id do usuario logado para popular seus dados no client*/
		var id_user = {'id_user': Service.get_user()};
			
			//busca os dados do proprio usuario
			Service.post('user','get_data',id_user).then(
				function(respon){ //SUCESSO
				
					/*fix birthday*/
					respon.data.birthday = respon.data.birthday.split("-");
					respon.data.birthday = respon.data.birthday[2][0] + respon.data.birthday[2][1] + '/' 
						+ respon.data.birthday[1] + '/' + respon.data.birthday[0];
				
					if(respon.data.gender = 'm')
						respon.data.gender = 'masculino';
					else 
						respon.data.gender = 'feminino';

					$scope.user = respon.data
					//$scope.login = respon.data.login;
				},

				function(respon){ //FALHA
					console.log('erro ao procurar usuario');
				}
			);

			$scope.get_userTweets = function(){
				$scope.tweetsList = [];
					
					
				Service.post('tweet','get_tweets', id_user).then(
					function(respon){
						//$scope.tweetsList = respon.data;
						//console.log("tweet list: " + $scope.tweetsList);	

						/*fix date*/
						for(j=0; j < respon.data.length; j++) {
							console.log(respon.data[j].timestamp);
							time = respon.data[j].timestamp.split('-');
							respon.data[j].month = time[1];
							respon.data[j].year = time[0];
							time = time[2].split('T');
							respon.data[j].day = time[0];
							time = time[1].split(':');
							respon.data[j].minute = time[1];
							respon.data[j].hour = time[0];
							//adiciona cada tweet na lista
							$scope.tweetsList.push( respon.data[j] );
						}//for

						//ordena os tweets colocando o mais recente na frente
						$scope.tweetsList.sort(function(a, b) {
							if(parseFloat(b.hour) - parseFloat(a.hour) != 0)
    							 return parseFloat(b.hour) - parseFloat(a.hour);
    						else return parseFloat(b.minute) - parseFloat(a.minute);
						});
					},
					//falha
					function(respon) {
						console.log("falha ao listar tweets!");
					}					
				);
						
			}///get_userTweets
		
		});
