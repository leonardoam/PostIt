
	var myApp = angular.module('App',  ['ngRoute', 'ngSanitize']);

    //configuracao para ngEnter, usado na busca
	myApp.directive('ngEnter', function () {
	    return function (scope, element, attrs) {
	        element.bind("keydown keypress", function (event) {
	            if(event.which === 13) {
	                scope.$apply(function (){
	                    scope.$eval(attrs.ngEnter);
	                });
	 
	                event.preventDefault();
	            }
	        });
	    };
	});

//ROTAS ------------------------------------------------------------------------------------------
	myApp.config(['$routeProvider', '$locationProvider',
	   function($routeProvider, $locationProvider){
		    $routeProvider. /*Pagina inicial*/
		    when('/',{
				templateUrl: 'templates/index.html',
			}).
		    when('/signup',{ /*pagina de cadastro*/
			  	templateUrl: 'templates/signup.html',
			}).
		    when('/content',{ /*pagina da timeline*/
			  	templateUrl: 'templates/content.html',
			}). 
		    when('/groups:groupParam',{ /*pagina de um grupo, que recebe como parametro o id do grupo e o seu nome*/
			  	templateUrl: 'templates/groups.html',
			}).
			when('/profile:id_user',{ /*pagina de perfil de um usuario, recebendo como parametro um id do usuario*/
			  	templateUrl: 'templates/profile.html',
			}).
			when('/statistic',{ /*pagina de estatisticas */
			  	templateUrl: 'templates/statistic.html',
			}).
			when('/config',{ /* pagina para alterar os dados do usuario */
			  	templateUrl: 'templates/profileconfig.html',
			}).
			when('/search',{ /* pagina para mostrar as buscas feitas*/
			  	templateUrl: 'templates/search.html',
			}).
		    otherwise({
		   		redirectTo: '/'
			});
	    }
	]);
