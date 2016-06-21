/*
-------------------- STATISTICS --------------------
Controlador para funcionalidades ligadas as estatisticas
Metodos:
	getStatistics: recebe as estatisticas dos top20 usuarios e top 20publicacoes
	redirectTo: para carregar um perfil quando nao se tem o 'login' do usuario 
*/

myApp.controller('statistics-controller', function ($scope, Service, $location) {
		
		$scope.getStatistics = function() {
			//var option = $routeParams.show.split('=')[1];

			//get top20users
			Service.post('statistics','top_users', {id:0}).then(
			function(respon){
				$scope.topUsersList = respon.data;
				//console.log($scope.topUsersList);
				}
			);
			
			//get top_publications
			Service.post('statistics','top_publications', {id:0}).then(
			function(respon){
				$scope.topPublicationsList = respon.data;
				//console.log($scope.topUsersList);
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
	});