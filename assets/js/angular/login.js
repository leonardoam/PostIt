/*
-------------------- LOGIN --------------------
Controlador para funcionalidades relacionadas a autenticacao do usuario bem como aos import e exportes do banco
A autenticacao foi feita usando um token para o Local Storage, mantendo assim a permanencia do dado.

Metodos:
    login: para autenticar
    logout: para deixar de autenticar
    addFile e uploadedFile: recebem um arquivo .json para o import
    exportBD: exporta o banco de dados em um json, exibindo na tela o resultado
*/

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

		$scope.uploadedFile = function(element) {
			$scope.$apply(function($scope) {
				$scope.files = element.files;         
			});
		}

      	$scope.addFile  = function(){
      		Service.post('maintenance','import_data',$scope.files[0]).then(
      			function(result){
      				Service.post('maintenance','create_fk').then(
      					function(result){
                            alert("Banco importado com sucesso. :D");
                        }
      				);
      			}
      		);
      	}

      	$scope.exportBD = function(){
      		window.location.replace("http://localhost:1337/maintenance/export_data");
      	}
    });