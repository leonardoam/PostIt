/*
-------------------- SERVICO --------------------
Servico que facilida na hora de fazer requisicoes para o servidor, verificar a autenticacao do usuario
e para armazenar os dados de alguma busca feita
*/
	myApp.factory('Service', function ($http) {

		var search = "";

		return { 
			//REQUISICOES
			'post': function(controller, method, data){
				return $http.post('/' + controller + '/' + method, data);
			},

			'get': function(controller, method, data){
				return $http.get('/' + controller + '/' + method, data);
			},

			//AUTENTICACAO
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
			},

			//BUSCA
			'set_search': function(data){
				search = data;
			},

			'get_search': function(){
				return search;
			}
		}
	});