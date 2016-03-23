(function(angular) {
    'use strict';

    var app = angular.module('my-App', []);

    app.controller('Postit-Controller', ['$scope', function($scope) {
    	
    	$scope.signupPage = "signup.html";
    	    
      $scope.doSomething = function() {
      	console.log("Hi, I just did something!");

        };
    }]);
})(window.angular);
