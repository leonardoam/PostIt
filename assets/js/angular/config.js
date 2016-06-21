/*
-------------------- CONFIG --------------------
Controlador para funcionalidades relacionadas as configuracoes do usuario

Metodos:
    alter_data: altera os dados do usuario, passando por validacao
    alter_password: altera o password do usuario, passando por validacao
    delete_user: deleta o proprio usuario
*/


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