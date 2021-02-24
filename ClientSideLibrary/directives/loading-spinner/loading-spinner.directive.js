(function() {
	'use strict';
	
	angular
		.module('clientside.directives')
		.directive('loadingSpinner', loadingSpinner);
	
	function loadingSpinner() {
		return {
			restrict: 'EA',
			templateUrl: 'ClientSideLibrary/dist/views/loading-spinner/loading-spinner.html',
			scope: {
				load: "="
			},
			link: link
		}

		function link(scope, element, attrs, form) {

		}
	};	
})();