(function() {
	'use strict';
	
	angular
		.module('user.portal')
		.constant('Constants', {
			Urls: {
				BaseUrl: "http://localhost/marlboro/api/",
				MarlboroBaseUrl: "https://marlboro.coreproc.dev",
				AccountApi: "account/"
			},
			
			Guide: 1,
			StickyLevel: 25
		});
	
})();