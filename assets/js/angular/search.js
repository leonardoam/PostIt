/*
-------------------- SEARCH --------------------
Controlador para funcionalidades ligadas as buscas
Metodos:
	search: metodo que eh ativado quando o usario realiza uma busca, colocando no Servico a busca que ele realiza,
			eh necessario isso pois a pagina se altera e o controllador muda, portanto a busca precisa ser armazenada
			de forma permanente
	find: busca no Servico a busca e realiza ela, buscando por usuarios com o nome igual ou parecido com o digitado e
		  os grupos com o nome identido ao procurado
*/


myApp.controller('search-controller', function ($scope, Service,$location,$route) {
		
		$scope.search = function(){
			if($scope.busca == "" || $scope.busca == undefined){
				return 0;
			}

			Service.set_search($scope.busca);
			$scope.busca = "";

			x = location.href.split('#/');
			if(x[1] == 'search')
				$route.reload();
			else
				$location.path('/search');
		}

		$scope.find = function(){
			var search = Service.get_search();

			if(search == "" || search == undefined){
				$location.path('/content');
				return 0;
			}

			Service.set_search("");

			$scope.users = "";
			$scope.findusers = 'false';

			Service.post('user','find_user_using_string',{'name_user': search}).then(
				function(respon){
					if(respon.data.length != 0) $scope.findusers = 'true';
					$scope.users = respon.data;
				}
			);

			$scope.groups = {};
			$scope.findgroup = 'false';
			Service.post('group','find_groups_and_masters',{'name_group': search}).then(
				function(respon){
					if(respon.data.length != 0) $scope.findgroup = 'true';
					$scope.groups = respon.data;
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