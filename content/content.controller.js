(function() {
	'use strict';
	
	angular
		.module('user.portal')
		.controller('contentCtrl', contentCtrl);
	
	contentCtrl.$inject = ['$timeout', '$window', 'appService', 'preloader']

	function contentCtrl($timeout, $window, appService, preloader) {
        var vm = this;
        vm.load = true;
        
        vm.fullScreenWidth = 450;
        vm.desiredWidthToHeight = 0.5624992968758789;
        
        $(document).ready(function(){
        	var newWidth = $window.innerWidth;
            var newHeight = $window.innerHeight;
            var newWidthToHeight = newWidth / newHeight;
        	
            if(newWidth > vm.fullScreenWidth) {
        		newWidth = newHeight * vm.desiredWidthToHeight;
        		angular.element("#game").css("height", (newHeight) + 'px');
    			angular.element("#game").css("width", (newWidth) + 'px');
    			angular.element("#game").css('left', '50%');
    			angular.element("#game").css('top', '50%');
        		angular.element("#game").css('margin-top', (-newHeight / 2) + 'px');
        		angular.element("#game").css('margin-left', (-newWidth / 2) + 'px');
    		} else {
    			angular.element("#game").css("height", (newHeight) + 'px');
    			angular.element("#game").css("width", (newWidth) + 'px');
    		}
        	
        	angular.element("#game-canvas").css('width', (newWidth) + 'px');
        	angular.element("#game-canvas").css('height', (newHeight) + 'px');
        	
        	appService.setHeight(newHeight);
        	appService.setWidth(newWidth);
        	
        	var el = document.querySelector('html');
        	bodyScrollLock.disableBodyScroll(el);
        	
        	vm.pictures = [
        		"assets/images/bg.jpg",
        		"assets/images/design.png",
        		"assets/images/home-design.png",
        		"assets/images/main-bg.jpg",
        		"assets/images/main-logo-white.png",
        		"assets/images/main-logo.png",
        		"assets/images/marlboro.png",
        		"assets/images/white-bg.jpg",
        		"assets/images/assemble.png",
        		"assets/images/slide.png",
        		"assets/images/win.png",
        		"assets/images/timer.png",
        		"assets/images/puzzle/1.jpg",
        		"assets/images/puzzle/2.jpg",
        		"assets/images/puzzle/3.jpg",
        		"assets/images/puzzle/4.jpg",
        		"assets/images/puzzle/5.jpg",
        		"assets/images/puzzle/6.jpg",
        		"assets/images/puzzle/7.jpg"
        	];
        	
        	preloader.preloadImages(vm.pictures)
        	.then(function() {
        		vm.load = false;
        	})
        	.catch(function() {
               console.log('failed');
           });
        });
        
	}
	
})();
