﻿
	var myApp = angular.module('App',  ['ngRoute']);
		
	//retorna um objeto "template" para os controllers e o ng-model trabalharem
	// Os dados são definidos no serviço, assim, mais controladores interessados
    //	nos dados tem somente que declarar/registrar o serviço -> modularização.

	myApp.config(['$routeProvider', '$locationProvider',
	   function($routeProvider, $locationProvider){
	      $routeProvider.
	      when('/',{
		     templateUrl: 'templates/index.html',
		      controller: 'userlogin'
		  }).
	      when('/signup',{
		    templateUrl: 'templates/signup.html',
		    controller: 'usercontroller'
		  }).
	       when('/content',{
		    templateUrl: 'templates/content.html',
		    controller: 'contentcontroller'
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
				},

				'doLogin': function(auth_data){
					//return $http.post('/user/login', auth_data);
					//return $http.post('/user/create_user_debug', user);
					return $http.post('/user/login', auth_data);
					
				},
				'createTweet': function(tweet_data){
					//return $http.post('/user/login', auth_data);
					//return $http.post('/user/create_user_debug', user);
					return $http.post('/tweet/create_tweet', tweet_data);
					
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

	myApp.controller('userlogin', function ($scope, Service) {
		$scope.auth_data = {};
		$scope.login_status = false;
	

		$scope.doLogin = function(login_data) {
			$scope.isCollapsed = false;
			console.log("login data:" );
        	$scope.auth_data = angular.copy(login_data);
        	console.log("user: " + $scope.auth_data.user);
        	console.log("pass: " + $scope.auth_data.password);
      
      		//$scope.login_status = Service.doLogin($scope.auth_data);
      		

      		Service.doLogin($scope.auth_data).then(
				//Success
				function(respon){
					//console.log("respon.data: " + respon.data['is_authenticated']);
					/*carregar o modelo do usuario logado neste momento*/
					$scope.login_status = respon.data['is_authenticated'];
				
				},
				//error
				function(respon){
					console.log('Erro ao recuperar lista do servidor...');
				}
			);
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


	myApp.controller('contentcontroller', function ($scope, Service) {
		$scope.master = {};

		$scope.createTweet = function(tweetToPost) {
        	$scope.master = angular.copy(tweetToPost);
        	console.log("title: " + $scope.master.title);
        	console.log("tweet: " + $scope.master.tweet);
        	
        	/****** TODO verificar usuario atual *****/
        	$scope.master['user_id'] = 1; //fix me 
        	Service.createTweet($scope.master);

      };	
		
	});

	myApp.controller('c2', function ($scope, Service) {
		$scope.tasks = Service.get_tasks();
		$scope.remove = function() {
			Service.del_tasks();
			$scope.tasks = Service.get_tasks();
			
		}
		//$scope.tasks = Service;
	});

	
