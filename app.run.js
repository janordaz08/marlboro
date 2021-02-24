//(function() {
//	'use strict';
//	
//	angular
//		.module('user.portal')
//		.run(run);
//	
//	run.$inject = ['$q', '$rootScope', '$window', '$state', '$timeout', '$transitions', 'historyService', 'appService']
//	
//	function run($q, $rootScope, $window, $state, $timeout, $transitions, historyService, appService) {
//
//		var authToken;
//		
//		var flow = ['main.home', 'main.how-to-play', 'main.play'];
//		
//		$transitions.onStart({}, function(transition) {
//		});
//		
//		$transitions.onBefore({ entering: flow[0] }, function(transition, state) {
//			historyService.addHistory(flow[0]);
//			var hist = historyService.getHistory();
//			if(hist.length == 1 && hist[0] == flow[0]) {
//				return true;
//			} else {
////				$state.go(flow[0]);
//				return false
//			}
//		});
//		$transitions.onBefore({ entering: flow[1] }, function(transition, state) {
//			historyService.addHistory(flow[1]);
//			var hist = historyService.getHistory();
//			if(hist.length == 1) {
//				historyService.clear();
//				$state.go(flow[0]);
//			}
//			if(hist.length == 2 && (hist[0] == flow[0] && hist[1] == flow[1])) {
//				return true;
//			} else {
////				$state.go(flow[0]);
//				return false
//			}
//		});
//		$transitions.onBefore({ entering: flow[2] }, function(transition, state) {
//			historyService.addHistory(flow[2]);
//			var hist = historyService.getHistory();
//			if(hist.length == 1) {
//				historyService.clear();
//				$state.go(flow[0]);
//			}
//			if(hist.length == 3 && (hist[0] == flow[0] && hist[1] == flow[1] && hist[2] == flow[2])) {
//				return true;
//			} else {
////				$state.go(flow[0]);
//				return false;
//			}
//		});
//
//		$transitions.onFinish({}, function(transition) {
//			console.log("it got transffered to: ", transition.$to().name);
//		});
//
//
//
//	}	
//})();