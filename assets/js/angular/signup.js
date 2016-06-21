/*
-------------------- SIGNUP --------------------
Controlador para criar os usuario
Metodo:
    createUser: cria um usuario, passando pelo formulario de validacao  
*/

	myApp.controller('signup-controller', function ($scope, Service, $location, Validacao) {
		$scope.user = {};

		$scope.createUser = function(user) {
        	$scope.user = angular.copy(user);

        	var letras = /^[A-Za-z]+$/;
        	var letrasComEspaco = /^[A-Za-z ]+$/;
    		var numeros = /^[0-9]+$/;


    		//validacao do formulario
    		if(!Validacao.firstname(user.firstname)) return 0;
    		if(!Validacao.lastname(user.lastname)) return 0;
    		if(!Validacao.email(user.email)) return 0;
    		if(!Validacao.login(user.login)) return 0;
    		if(!Validacao.password(user.password,user.passwordConfirm)) return 0;
    		if(!Validacao.bio(user.description)) return 0;
            if(!Validacao.gender(user.gender)) return 0;
            if(!Validacao.birthday(user.birthday)) return 0;

        	Service.post('user','create_user',user);
        	alert("Usuário " + user.login + " criado com sucesso!");
        	$location.path('/');
        };


	});