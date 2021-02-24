(function() {
	'use strict';
	
	angular
		.module('user.portal')
		.factory('historyService', historyService);
	
	function historyService() {
		var historyArray = [];
		
		var service = {
			getHistory: getHistory,
			addHistory: addHistory,
			clear: clear
		};
		
		return service;
		
		function getHistory() {
			return historyArray;
		}

		function addHistory(history) {
			historyArray.push(history)
		}
		
		function clear() {
			historyArray = [];
		}
		
	}
	
})();