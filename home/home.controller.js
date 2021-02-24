(function() {
	'use strict';
	
	angular
		.module('user.portal')
		.controller('homeCtrl', homeCtrl);
	homeCtrl.$inject = ['$scope', '$timeout', '$state', '$stateParams', 'accountService', 'appService', 'Constants'];
	
	function homeCtrl($scope, $timeout, $state, $stateParams, accountService, appService, Constants) {
        var vm = this;
        
        vm.next = next;
        vm.state = 1;
        vm.$onInit = init;
        vm.timesUp = false;
        vm.audio = null;
        vm.gameOver = false;
        vm.completed = false;
        vm.guideLevel = Constants.Guide;
        vm.stickyLevel = Constants.StickyLevel;
        vm.showHint = false;
        vm.showText = true;
        vm.textOverlay = [
        	"WE TRAVEL THE WORLD TO FIND THE BEST TOBACCO.",
        	"MARLBORO IS ENJOYED IN OVER 150 COUNTRIES WORLDWIDE.",
        	"OUR PACKS PASSED 1,000 QUALITY CHECKS.",
        	"OUR TOBACCO IS HAND-SORTED FOR QUALITY.",
        	"OVER 100 YEARS OF HISTORY.",
        	"ONLY 3 PEOPLE IN THE WORLD KNOW OUR SECRET BLEND.",
        	"ALL MARLBORO CIGARETTES ARE INDIVIDUALLY QUALITY CHECKED."
        ];
        
        function isMobile() {
			var check = false;
			(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
			return check;
    	};
        
        function init() {
        	vm.searchParams = new URLSearchParams(window.location.search);
        	vm.userToken = vm.searchParams.get('token');
        	
        	if(!vm.userToken) {
        		//should redirect to somewhere if not provided
        		vm.userToken = 1;
        	}
        	
        	//We should verify user here
        	
        	if(isMobile()) {
        		document.addEventListener("visibilitychange", function() {
        			if(vm.audio != null) {
        				if (document.hidden) {
        					vm.audio.pause();
        				} else {
        					vm.audio.play();
        				}
        			}

        	    }, false);
        	}
        	
        	var request = {};
        	request.user = vm.userToken;
        	accountService.getLevel(request)
        	.then(function(response) {
        		vm.level = response;
        		if(vm.audio == null && vm.level.p != 0) {
        			initPuzzle();
        		}
        		$timeout(function(){
                    $("#play-now").click(function(event) {
                    	if(vm.audio == null) {
                    		vm.audio = new Audio('assets/game-audio.m4a');
                    		vm.audio.play();
                    		vm.audio.addEventListener('ended', restartAudio);
                    	}
                        next();
                    });
                }, 100);
        	})
        	.catch(function(error) {
        		
        	});
        }
        
        function next() {
        	if(vm.level.p == 0) {
        		return;
        	}
        	vm.state++;
        	if(vm.state == 2) {
        		$timeout(function() {
        			$timeout(function() {
        				$(".main-design-how-to-init").removeClass('main-design-how-to-init');
        			}, 200);
        			$timeout(function() {
        				$(".marlboro-how-to-play-logo-init").removeClass('marlboro-how-to-play-logo-init');
        			}, 500);
        			$timeout(function() {
        				$(".how-to-play-init").removeClass('how-to-play-init');
        			}, 750);
        			$timeout(function() {
        				$(".slide-init").removeClass('slide-init');
        			}, 1000);
        			$timeout(function() {
        				$(".slide-text-init").removeClass('slide-text-init');
        			}, 1250);
        			$timeout(function() {
        				$(".assemble-init").removeClass('assemble-init');
        			}, 1500);
        			$timeout(function() {
        				$(".assemble-text-init").removeClass('assemble-text-init');
        			}, 1750);
        			$timeout(function() {
        				$(".win-init").removeClass('win-init');
        			}, 2000);
        			$timeout(function() {
        				$(".win-text-init").removeClass('win-text-init');
        			}, 2250);
        			$timeout(function() {
        				$(".how-to-page").addClass('.how-to-page-end');
        				$timeout(function() {
        					next();
        				}, 500);
        			}, 6000);
        		});
        	}
        	if(vm.state == 3) {
        		$timeout(function() {
        			$timeout(function() {
        				$(".game-page-init").removeClass('game-page-init');
        			}, 500);
        		});
        	}
        	if(vm.state == 4) {
        		$timeout(function() {
        			var myCanvas = document.getElementById('confetti');
        			var end = Date.now() + (15 * 200);
        			var myConfetti = confetti.create(myCanvas, {
        			  resize: true,
        			  useWorker: true
        			});
        			var width = appService.getWidth();
        			var velocity = 45;
        			var count = 4;
        			if(width < 650 && width >= 600) {
        				velocity = 40;
        			}
        			else if(width < 600 && width >= 550) {
        				velocity = 35;
        				count = 3;
        			}
        			else if(width < 550 && width >= 450) {
        				velocity = 30;
        				count = 3;
        			}
        			else if(width < 450) {
        				velocity = 20;
        				count = 2;
        			}
        			var colors = ['#c4232e', '#808080', '#f94137', '#4d4d4d'];
        			function throwConfetti() {
        				myConfetti({
        					particleCount: count,
        					angle: -90,
        					spread: 180,
        					startVelocity: velocity,
        					origin: { x: 0.5, y:-0.2 },
        					colors: colors
        				});
        				if (Date.now() < end) {
        					requestAnimationFrame(throwConfetti);
        				}
        			}
        			throwConfetti();
        			
        		});
        	}
        }
        
        function restartAudio() {
        	vm.audio.play();
        }
        
        //state 3
        vm.puzzleOptions = {};
        vm.start = start;
        vm.showNext = showNext;
        vm.puzzleFinished = puzzleFinished;
        vm.tryAgain = tryAgain;
        vm.next = next;
        vm.complete = complete;
        vm.homePage = homePage;
        vm.displayHint = displayHint;
        vm.worker = null
        
        function initPuzzle() {
        	
        	startWorker();
            vm.startTimer = function(){
            	vm.worker.postMessage({ status: true });
            };

            vm.stopTimer = function(){
            	vm.worker.postMessage({ status: false });
            };

            vm.finished = function(msg){
                console.info(msg)
            }
        	
            
            vm.img = [];
            
            while(vm.img.length < vm.level.n) {
            	var rand = Math.floor((Math.random() * 7) + 1);
            	if(vm.img.indexOf(rand) == -1) {
            		vm.img.push(rand);
            	}
            }
            
        }
        
        function startWorker() {
        	if (typeof(Worker) !== "undefined") {
        		if (typeof(w) == "undefined") {
        			vm.worker = new Worker("app.worker.js");
        	    }
        		
        		vm.worker.onmessage = function(event) {
        			vm.remaining = (event.data / 1000);
        			$scope.$evalAsync();
        			if(event.data == 0) {
        				timerFinished();
        			}
        	    };
        	    
        	} else {
        		alert("Sorry! No Web Worker support.");
        		window.href.location = "https://marlboro.ph";
        	}
        }
        
        function showNext() {
        	$(".puzzle-overlay").removeClass('puzzle-overlay-show');
        	vm.showText = false;
        	$timeout(function() {
        		vm.showText = true;
        	}, 1000);
        	vm.puzzleOptions.showNext();
        }
        
        function start() {
        	vm.puzzleOptions.start();
        	vm.startTimer();
        }
        
        function puzzleFinished() {
        	$timeout(function() {
        		$(".puzzle-overlay").addClass('puzzle-overlay-show');
        	}, 100);
        	vm.stopTimer();
        }
        
        function timerFinished() {
        	vm.gameOver = true;
        }
        
        function tryAgain() {
        	vm.state = 1;
        	$scope.$evalAsync();
        	vm.img = [];
            
            while(vm.img.length < vm.level.n) {
            	var rand = Math.floor((Math.random() * 7) + 1);
            	if(vm.img.indexOf(rand) == -1) {
            		vm.img.push(rand);
            	}
            }
            
            vm.timesUp = false;
            vm.gameOver = false;
            vm.completed = false;
            vm.showHint = false;
        	vm.gameOver = false;
        	vm.worker.postMessage({ reset: true });
        	init();
        }
        
        function complete() {
        	var request = {};
        	request.user = vm.userToken;
        	accountService.complete(request)
        	.then(function(response) {
        		//if in iframe, postMessage outside of iframe.
        		//main window should be subscribed to event
        		vm.completed = true;
        	})
        	.catch(function(error) {
        		
        	});
        }
        
        function homePage() {
        	//go to home page
        	tryAgain();
        }
        
        function displayHint() {
        	vm.showHint = !vm.showHint;
        }
        
	}
	
})();
