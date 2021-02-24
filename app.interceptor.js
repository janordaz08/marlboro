(function() {
	'use strict';
	
	angular
		.module('user.portal')
		.factory('httpInterceptorService', httpInterceptorService);
	
	httpInterceptorService.$inject = ['$q', '$state', '$window', 'Constants'];

	function httpInterceptorService($q, $state, $window, Constants) {

        var tokenHeader = 'Authorization',
            HTTP_TYPES_TO_ADD_TOKEN = ['GET', 'DELETE', 'POST', 'PUT'];


        var token;

        var service = {
            response: onSuccess,
            responseError: onFailure,
            request: onRequest,
        };

        return service;

        function onFailure(response) {
            return $q.reject(response);
        }

        function onRequest(config) {
        	if(HTTP_TYPES_TO_ADD_TOKEN.indexOf(config.method) >= 0 && localStorage.getItem(tokenHeader)) {
        		config.headers[tokenHeader] = localStorage.getItem(tokenHeader);
        	}
            return config;
        }

        function onSuccess(response) {
            // console.log("REQUEST SUCCESS");
            return response;
        }

	}
	
})();