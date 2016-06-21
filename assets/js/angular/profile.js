/*
-------------------- PROFILE --------------------
Controlador para funcionalidades relacionadas a pagina de perfil dos usuarios
Metodos:
	get_data: busca os dados pessoais do usuario para mostrar na pagina de perfil
	follow_user: comeca a seguir um usuario
	unfollow_user: deixa de seguir um usuario
*/

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