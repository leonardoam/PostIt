/*
-------------------- TWEET --------------------
Controlador para funcionalidades ligadas aos tweets (publicacoes)
Metodos:
	get_timeline: recebe as publicacoes feitas pelo usuario e por quem ele segue, bem como as republicacoes
				  que fizeram, ordenando pelo tempo
	get_userTweets: recebe as publicacoes de um usuario em especifico (usado para a pagina de profile)
	create_tweet: cria uma publicacao
	delete_tweet: deleta uma publicacao feita
	delete_share: deletar uma republicacao
	redirectTo: para carregar um perfil quando nao se tem o 'login' do usuario
	gotoGroup: para carregar uma pagina de grupo
	gotoProfile: para carregar uma pagina de perfil
*/

myApp.controller('tweet-controller', function ($scope, Service,$routeParams,$rootScope,$location) {

		$rootScope.$on("call-get_tweetsMethod", function(){
           $scope.get_tweets();
        });

		$scope.get_timeline = function(){
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

		$scope.create_tweet = function(tweetToPost) {
			var data = {};
        	data = angular.copy(tweetToPost);
        	data['id_user'] = Service.get_user();

        	Service.post('tweet','create_tweet',data).then(
        		function(err){
        			$scope.get_timeline();
        			$rootScope.$emit("call-getUserDataMethod", {});
        		},
        		function(err){
        			alert(" Algum erro ocorreu! Sua mensagem não pode ser enviada! :( ");
        		}
        	);

        	$scope.tweetToPost.tweet = "";
        	$scope.tweetToPost.title = "";
      	}

      	$scope.delete_tweet = function(tweet){
      		Service.post('tweet','delete_tweet',{'id_tweet': tweet.id}).then(
      			function(respon){
      				$scope.get_timeline();
      				$rootScope.$emit("call-getUserDataMethod", {});
      			}
      		);
      	}

      	$scope.delete_share = function(tweet){
      		Service.post('share','delete_share',{'id_tweet': tweet.id}).then(
      			function(respon){
      				console.log(respon.data);
      				$scope.get_timeline();
      				$rootScope.$emit("call-getUserDataMethod", {});
      			}
      		);
      	}

      	$scope.redirectTo = function(x){
			Service.post('user','find_user',{'login_user': x}).then(
				function(respon){
					$location.path('/profile:'+ respon.data.id);
				}
			);
		}

		$scope.gotoGroup = function(group){
			$location.path('/groups:'+ group.id+':'+group.name);
		}

		$scope.gotoProfile = function(user){
			$location.path('/profile:'+ user.id);
		}
	});