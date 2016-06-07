
	var myApp = angular.module('App', ['ngRoute']);
	//retorna um objeto "template" para os controllers e o ng-model trabalharem
	// Os dados são definidos no serviço, assim, mais controladores interessados
    //	nos dados tem somente que declarar/registrar o serviço -> modularização.

	myApp.config(['$routeProvider', '$locationProvider',
	   function($routeProvider, $locationProvider){
	      $routeProvider.
	      when('/',{
		     templateUrl: 'templates/index.html',
		      controller: 'c1'
		  }).
	      when('/signup',{
		    templateUrl: 'templates/signup.html',
		    controller: 'usercontroller'
		  }).
	       when('/content',{
		    templateUrl: 'templates/content.html',
		    controller: 'c2'
		  }).
	        when('/groups',{
		    templateUrl: 'templates/groups.html',
		    controller: 'c2'
		  }).
		 when('/profile',{
		    templateUrl: 'templates/profile.html',
		    controller: 'c2'
		  }).
		 when('/statistic',{
		    templateUrl: 'templates/statistic.html',
		    controller: 'c2'
		  }).
	      otherwise({
		     redirectTo: '/'
		  });
	      
	       // use the HTML5 History API
	      //fix url like /#/profile to just /profile (without hashtag)
	      //$locationProvider.html5Mode(true).hashPrefix('!');
	   }
	   ]);
	
	myApp.factory('Service', function ($http) {
		var tasks = [];
		
		return { 
				'set_tasks': function(task) {
					tasks.push({text:task,done:false});
				},

				// Gets the list of tasks in memory
				'get_tasks': function() {
					return tasks;
				},
				'del_tasks': function() {
					var old = tasks;
					tasks = [];
					angular.forEach(old, function (x){
					   if(!x.done) tasks.push(x);
					 });
					 
				},
				'save': function(tasks){
				    return $http.post('/task/save',tasks);
				},
				'read': function(){
					return $http.get('/task/read');
				},
				'put_tasks': function(tasks_par){
					tasks = tasks_par;
				},
				'clean_tasks': function(){
					tasks = [];
					return tasks;
				},

				'createUser': function(user){
					return $http.post('/user/create_user', user);
					//return $http.post('/user/create_user_debug', user);
				} 
		}
	});

	
	myApp.controller('usercontroller', function ($scope, Service) {
		$scope.master = {};

		$scope.sendNewUser = function(user) {
        	$scope.master = angular.copy(user);
        	console.log("user: " + $scope.master.firstname);
        	console.log("user: " + $scope.master.lastname);
        	console.log("user: " + $scope.master.user);
        	console.log("user: " + $scope.master.password);
        	console.log("user: " + $scope.master.email);
        	console.log("user: " + $scope.master.birthday);
        	console.log("user: " + $scope.master.birthmonth);
        	console.log("user: " + $scope.master.birthyear);
        	console.log("user: " + $scope.master.description);

        	Service.createUser($scope.master);

      };
		
		
		
	});

	myApp.controller('c1', function ($scope, Service) {
		$scope.createTask = function() {
			Service.set_tasks($scope.task);
			//event.Data.task = null;
			$scope.task = "";
		},
		$scope.save = function(){
			Service.save(Service.get_tasks()).then(
				//success
				function(response){
					console.log('Ok ao Salvar a Lista.');
				},
				//Error
				function(response){
					console.log('Erro ao Salvar a Lista.');
				}
			);
		},
		$scope.read = function(){
			//Service.clean_tasks();
			//$scope.tasks = Service.get_tasks();
			
			Service.read().then(
				//Success
				function(respon){
					angular.forEach(respon.data, function (x){
					   Service.set_tasks(x.text, x.done); 
					 });
				},
				//error
				function(respon){
					console.log('Erro ao recuperar lista do servidor...');
				}
			);
		}
	});

	myApp.controller('c2', function ($scope, Service) {
		$scope.tasks = Service.get_tasks();
		$scope.remove = function() {
			Service.del_tasks();
			$scope.tasks = Service.get_tasks();
			
		}
		//$scope.tasks = Service;
	});
