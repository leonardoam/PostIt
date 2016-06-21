/*
-------------------- USERDATA --------------------
Controlador que tem como objetivo carregar os dados do usuario
Métodos:
	getUserData: busca os dados pessoais do usuario, os seguidores e quem segue e a quantidade de postagens (esse método é utilizado
				 principalmente na página de 'group' e 'content' para exibir informacoes no canto superior esquerdo da pagina)
	goToProfile: para enviar o usuario para a pagina de profile de algum outro usuario
*/

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
					$scope.followersLength = respon.data.length;
					$scope.followers = respon.data;
				},
				function(respon){
					console.log('erro ao procurar seguidores');
				}
			);


			//quem segue ele
			Service.post('follow','get_follows',id_user).then(
				function(respon){
					$scope.followsLength = respon.data.length;
					$scope.follows = respon.data;
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

		$scope.goToProfile = function(id){
			if(id == "")
				$location.path('/profile:'+Service.get_user());
			else
				$location.path('/profile:'+id);
		}
	});