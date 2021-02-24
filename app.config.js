(function() {
	'use strict';
	
	angular
		.module('user.portal')
		.config(config);
	
	config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide'];

	function config($stateProvider, $urlRouterProvider, $httpProvider, $provide) {
		
		var IN_DEVELOPMENT = false;

		$provide.decorator('$log', ['$delegate', function ($delegate) {
			var originals = {};
			var methods = ['info' , 'debug' , 'warn' , 'error'];
			
			angular.forEach(methods , function(method) {
			    originals[method] = $delegate[method];
			    $delegate[method] = function() {
			        if (IN_DEVELOPMENT) {
			            var args = [].slice.call(arguments);
			            var timestamp = new Date().toString();
			            args[0] = [timestamp.substring(4 , 24), ': ', args[0]].join('');
			                originals[method].apply(null , args);
			        }
			    };
			});
			
			   return $delegate;
		}]);

		$stateProvider						
			.state('main', {
				url: '/main',
				templateUrl: 'content/main.html',
				abstract: true,
				params:{
				}
			})
			.state('main.home', {
				url: '^/',
				templateUrl: 'home/home.html',
				controller: 'homeCtrl',
				controllerAs: 'vm',
				params:{
					userToken: null
				}
			});

		$urlRouterProvider.otherwise("/");


	}
	
})();