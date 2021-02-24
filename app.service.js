(function() {
	'use strict';
	
	angular
		.module('user.portal')
		.factory('appService', appService);
	
	function appService() {
		var levelData;
		var width;
		var height;
		
		var service = {
			getLevelData : getLevelData,
			setLevelData : setLevelData,
			getHeight : getHeight,
			setHeight : setHeight,
			getWidth : getWidth,
			setWidth : setWidth
		};
		
		return service;
		
		function setLevelData(level) {
			levelData = level;
		}

		function getLevelData() {
			return levelData;
		}
		
		function setHeight(h) {
			height = h;
		}
		
		function getHeight() {
			return height;
		}
		
		function setWidth(w) {
			width = w;
		}
		
		function getWidth() {
			return width;
		}
	}
	
})();