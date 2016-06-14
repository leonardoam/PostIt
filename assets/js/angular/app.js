
	var myApp = angular.module('App',  ['ngRoute']);
		
	//retorna um objeto "template" para os controllers e o ng-model trabalharem
	// Os dados são definidos no serviço, assim, mais controladores interessados
    //	nos dados tem somente que declarar/registrar o serviço -> modularização.


//ROTINAS ------------------------------------------------------------------------------------------
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

//SIGNUP ------------------------------------------------------------------------------------------
	myApp.controller('signup-controller', function ($scope, Service, $location) {
		$scope.master = {};

		$scope.createUser = function(user) {
        	$scope.master = angular.copy(user);
        	Service.post('user','create_user',$scope.master);
        	alert("Usuário " + $scope.master.user + " criado com sucesso!");
        	$location.path('/#');
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
					$location.path('/content');
				},

				function(respon){	//FALHA
					alert("Nome de usuário ou senha incorretos!");
				}
			);
      	}

      	$scope.logout = function(){
      		Service.set_auth(false);
      		Service.set_user(0);
      		$location.path('/');
      	}

      	$scope.goPage = function(local){
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

        }

        $scope.groupSelected = function(group) {
        	$location.path('/groups:' + group.relativeId + ':' + group.name);
        }
	});
	
//USERDATA ------------------------------------------------------------------------------------------
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

//TWEET ------------------------------------------------------------------------------------------
/* Metodos:
	getTweets(): retorna os tweets feitos pelo usuario e por quem ele segue em ordem por hora(timeline)
	createTweets(): cria um novo tweet
*/
	myApp.controller('tweet-controller', function ($scope, Service) {

		$scope.getTweets = function(){
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
		};

		$scope.createTweet = function(tweetToPost) {
			var data = {};
        	data = angular.copy(tweetToPost);
        	data['id_user'] = Service.get_user();

        	Service.post('tweet','create_tweet',data).then(
        		function(err){
        			$scope.getTweets();
        			$scope.getUserData();
        		},
        		function(err){
        			alert(" Algum erro ocorreu! Sua mensagem não pode ser enviada! :( ");
        		}
        	);
      	};
	});

//PROFILE ------------------------------------------------------------------------------------------
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
