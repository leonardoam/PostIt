
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
		    when('/groups',{
			  	templateUrl: 'templates/groups.html',
			  	controller: 'c2'
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
	myApp.controller('group-controller', function ($scope, Service) {
		$scope.master = {};

		$scope.createGroup = function(user) {
			var group_data = {'id_user': Service.get_user(), 'group_name': $scope.groupName};
			/*
			async.series([
				function(callback){
					Service.post('group','create_group',group_data);
				},
				function(callback){
					group_data = {
		        		'id_user': Service.get_user(),
		        		'group_name': $scope.groupName,
		        		'id_master': Service.get_user()
        			};

        			Service.post('group','join_group',group_data);
				},
			]);*/
			
			//cria o grupo
        	Service.post('group','create_group',group_data).then(
				function(respon){	//SUCESSO
					//se der tudo certo entao coloca o usuario no grupo q acabou se ser criado
					group_data = {
		        		'id_user': Service.get_user(),
		        		'group_name': $scope.groupName,
		        		'id_master': Service.get_user()
        			};
				},

				function(respon){	//FALHA
					alert("falha ao tentar criar um grupo!");
				}
			).then(
				function(respon){
					Service.post('group','join_group',group_data);
				},
				function(respon){}
			);
        };
	});
	
	//CONTROLADOR PARA BUSCAR OS DADOS DO USUARIO LOGADO
	myApp.controller('userData-controller', function($scope,Service) {

		$scope.getUserData = function(){
			console.log("rodando!");
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
					console.log("tweets :" + respon.data.length);
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

			//procura quem o usuario logado segue
			Service.post('follow','get_followers',id_user).then(
				function(respon){

					//encontrando quem segue, entao busca os dados de todos, inclusive do proprio usuario
					for(i = 0; i <= respon.data.length; i++){
						if(i == respon.data.length)
							id_user = {'id_user': Service.get_user()};
						else
							id_user = {'id_user': respon.data[i].follows};

						//primeiro busca o nick deles
						//OBS:
						//	O CODIGO DESSE JEITO TA DANDO INCONSISTENCIA DO DADO $scope.nick PQ O
						//	JAVASCRIPT TENTA FAZER ESSES DOIS METODOS POST AQUI EMBAIXO PARALELAMENTE
						Service.post('user','get_data', id_user).then(
							function(respon){
								$scope.nick = respon.data.login;
							},
							function(respon){}
						);

						//depois procura as postagens que fizeram
						Service.post('tweet','get_tweets', id_user).then(
							function(respon){
								for(j = 0; j < respon.data.length; j++){
									respon.data[j].login = $scope.nick;

									//Separar a string de tempo timestamp
									//'2016-06-11T20:55:17.463Z'
									time = respon.data[j].timestamp.split("-");
									respon.data[j].month = time[1];
									respon.data[j].year = time[0];
									time = time[2].split("T");
									respon.data[j].day = time[0];
									time = time[1].split(":");
									respon.data[j].hour = time[0];
									respon.data[j].minute = time[1];

									$scope.tweetsList.push( respon.data[j] );
								}

								//ordena os tweets colocando o mais recente na frente
								$scope.tweetsList.sort(function(a, b) {
									if(parseFloat(b.hour) - parseFloat(a.hour) != 0)
    									 return parseFloat(b.hour) - parseFloat(a.hour);
    								else return parseFloat(b.minute) - parseFloat(a.minute);
								});
								
							},
							function(respon) {}
						);
					}
				},
				function(respon){}
			);

		};

		$scope.createTweet = function(tweetToPost) {
        	$scope.master = angular.copy(tweetToPost);
        	$scope.master['id_user'] = Service.get_user();

        	Service.post('tweet','create_tweet',$scope.master);
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
