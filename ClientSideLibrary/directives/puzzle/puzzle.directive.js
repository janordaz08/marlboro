(function() {
	'use strict';
	
	angular
		.module('clientside.directives')
		.directive('puzzle', puzzle);
	
	puzzle.$inject = ['$window', 'appService'];
	
	function puzzle($window, appService) {
		return {
			restrict: 'EA',
			templateUrl: 'ClientSideLibrary/dist/views/puzzle/puzzle.html',
			scope: {
				row: "=",
				col: "=",
				num: "=",
				img: "=",
				fnc: "=",
				enableSticky: "=",
				finishedCallback: "&"
			},
			link: link
		}

		function link(scope, element, attrs, form) {
			scope.fnc = scope.fnc || {};
			scope.currentPuzzle = 0;
			
			var PUZZLE_ROW = scope.row;
			var PUZZLE_COL = scope.col;
			var PUZZLE_HOVER_TINT = '#EF001F';
			
			var canvas;
			var stage;

			var img;
			var pieces;
			var puzzleWidth;
			var puzzleHeight;
			var pieceWidth;
			var pieceHeight;
			var currentPiece;
			var currentDropPiece;

			var mouse;
			extend();
			scope.finishedPuzzleArray = [];
			scope.$onInit = init;
			scope.hasLevelStarted = false;
			scope.hasLevelFinished = false;
			scope.hasPuzzleStarted = false;
			scope.hasPuzzleFinished = false;
			
			scope.$watchCollection("img", function( newValue, oldValue ) {
				if(!scope.hasLevelStarted) {
					init();
				}
			});
			
			function init(){
				img = new Image();
			    img.addEventListener('load',onImage,false);
			    img.src = "assets/images/puzzle/" + scope.img[scope.currentPuzzle] +".jpg";
			    scope.hasLevelStarted = true;
			    extend();
			}

			function onImage(e){
				scope.originalWidth = angular.copy(img.width);
				scope.originalHeight = angular.copy(img.height);
				if(img.width > appService.getWidth()) {
			    	var imgWidthRatio = appService.getWidth() / img.width;
			    	img.width = appService.getWidth();
			    	img.height = img.height * imgWidthRatio;
			    }
				
				img.width = img.width * 0.8;
				img.height = img.height * 0.8;
				
				scope.originalToScaledWidthRatio = scope.originalWidth / img.width;
				scope.originalToScaledHeightRatio = scope.originalHeight / img.height;
				
			    scope.originalPieceWidth = Math.floor(scope.originalWidth / PUZZLE_ROW);
			    scope.originalPieceHeight = Math.floor(scope.originalHeight / PUZZLE_COL);
			    pieceWidth = Math.floor(img.width / PUZZLE_ROW);
			    pieceHeight = Math.floor(img.height / PUZZLE_COL);
			    puzzleWidth = pieceWidth * PUZZLE_ROW;
			    puzzleHeight = pieceHeight * PUZZLE_COL;
			    setCanvas();
			    initPuzzle();
			    scope.hasPuzzleLoaded = true;
			    extend();
			}

			function setCanvas(){
			    canvas = document.getElementById('myCanvas');
			    stage = canvas.getContext('2d');
			    canvas.width = puzzleWidth;
			    canvas.height = puzzleHeight;
			    canvas.style.border = "1rem solid white";
			    canvas.style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 1px 10px 4px";
			    
			}

			function initPuzzle(){
			    pieces = [];
			    mouse = {x:0,y:0};
			    currentPiece = null;
			    currentDropPiece = null;
			    stage.drawImage(img, 0, 0, puzzleWidth, puzzleHeight);
			    buildPieces();
			}

			function createTitle(msg){
			    stage.fillStyle = "#000000";
			    stage.globalAlpha = .5;
			    stage.fillRect(100,puzzleHeight - 100,puzzleWidth - 200,40);
			    stage.fillStyle = "#FFFFFF";
			    stage.globalAlpha = 1;
			    stage.textAlign = "center";
			    stage.textBaseline = "middle";
			    stage.font = "20px YouDecide";
			    stage.fillText(msg, puzzleWidth / 2, puzzleHeight - 80);
			}

			function buildPieces(){
			    var i;
			    var piece;
			    var xPos = 0;
			    var yPos = 0;
			    for(i = 0;i < PUZZLE_ROW * PUZZLE_COL;i++){
			        piece = {};
			        piece.sx = xPos;
			        piece.sy = yPos;
			        pieces.push(piece);
			        xPos += pieceWidth;
			        if(xPos >= puzzleWidth){
			            xPos = 0;
			            yPos += pieceHeight;
			        }
			        scope.finishedPuzzleArray.push(piece);
			    }
			}

			function shufflePuzzle(){
			    pieces = shuffleArray(pieces);
			    stage.clearRect(0,0,puzzleWidth,puzzleHeight);
			    var i;
			    var piece;
			    var xPos = 0;
			    var yPos = 0;
			    for(i = 0;i < pieces.length;i++){
			        piece = pieces[i];
			        piece.xPos = xPos;
			        piece.yPos = yPos;
			        stage.drawImage(img, piece.sx * scope.originalToScaledWidthRatio, piece.sy * scope.originalToScaledHeightRatio, scope.originalPieceWidth, scope.originalPieceHeight, xPos, yPos, pieceWidth, pieceHeight);
			        stage.strokeRect(xPos, yPos, pieceWidth,pieceHeight);
			        xPos += pieceWidth;
			        if(xPos >= puzzleWidth){
			            xPos = 0;
			            yPos += pieceHeight;
			        }
			    }
			    canvas.onpointerdown = onPuzzleClick;
			    canvas.ontouchstart = onPuzzleClick;

			}

			function shuffleArray(o){
			    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			    return o;
			}

			function onPuzzleClick(e){
			    if(e.layerX || e.layerX == 0){
			    	
			        mouse.x = e.layerX;
			        mouse.y = e.layerY
			    }
			    else if(e.offsetX || e.offsetX == 0){
			        mouse.x = e.offsetX;
			        mouse.y = e.offsetY;
			    }
			    currentPiece = checkPieceClicked();
			    if(currentPiece != null){
			        stage.clearRect(currentPiece.xPos,currentPiece.yPos,pieceWidth,pieceHeight);
			        stage.save();
			        stage.globalAlpha = .9;
			        stage.drawImage(img, currentPiece.sx * scope.originalToScaledWidthRatio, currentPiece.sy * scope.originalToScaledHeightRatio, scope.originalPieceWidth, scope.originalPieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
			        stage.restore();
			        document.onpointermove = updatePuzzle;
			        document.onpointerup = pieceDropped;
			        
			        document.ontouchmove = updatePuzzle;
			        document.ontouchend = pieceDropped;
			    }
			}

			function checkPieceClicked(){
			    var i;
			    var piece;
			    for(i = 0;i < pieces.length;i++){
			        piece = pieces[i];
			        if(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)){
			        	// no hit
			        }
			        else{
			        	if(scope.enableSticky && piece.sx == piece.xPos && piece.sy == piece.yPos) {
			        		return null;
			        	}
			            return piece;
			        }
			    }
			    return null;
			}

			function updatePuzzle(e){
			    currentDropPiece = null;
			   
			    if(e.layerX || e.layerX == 0){
			        mouse.x = e.layerX;
			        mouse.y = e.layerY;
			    }
			    else if(e.offsetX || e.offsetX == 0){
			        mouse.x = e.offsetX;
			        mouse.y = e.offsetY;
			    }
			    stage.clearRect(0,0,puzzleWidth,puzzleHeight);
			    var i;
			    var piece;
			    for(i = 0;i < pieces.length;i++){
			        piece = pieces[i];
			        if(piece == currentPiece){
			            continue;
			        }
			        stage.drawImage(img, piece.sx * scope.originalToScaledWidthRatio, piece.sy * scope.originalToScaledHeightRatio, scope.originalPieceWidth, scope.originalPieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
			        stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
			        if(currentDropPiece == null){
			            if(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)){
			                //NOT OVER
			            }
			            else{
			            	currentDropPiece = piece;
			                if(currentDropPiece.sx != currentDropPiece.xPos || currentDropPiece.sy != currentDropPiece.yPos || 
			                		(!scope.enableSticky && currentDropPiece.sx == currentDropPiece.xPos && currentDropPiece.sy == currentDropPiece.yPos)) {
			                	stage.save();
			                	stage.globalAlpha = .4;
			                	stage.fillStyle = PUZZLE_HOVER_TINT;
			                	stage.fillRect(currentDropPiece.xPos,currentDropPiece.yPos,pieceWidth, pieceHeight);
			                	stage.restore();
			                }
			            }
			        }
			    }
			    stage.save();
			    stage.globalAlpha = .6;
			    stage.drawImage(img, currentPiece.sx * scope.originalToScaledWidthRatio, currentPiece.sy * scope.originalToScaledHeightRatio, scope.originalPieceWidth, scope.originalPieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
			    stage.restore();
			    stage.strokeRect( mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth,pieceHeight);
			}

			function pieceDropped(e){
			    document.onpointermove = null;
			    document.onpointerup = null;
			    
			    document.ontouchmove = null;
			    document.ontouchend = null;
			    if(currentDropPiece != null && (currentDropPiece.sx != currentDropPiece.xPos || currentDropPiece.sy != currentDropPiece.yPos || 
			    		(!scope.enableSticky && currentDropPiece.sx == currentDropPiece.xPos && currentDropPiece.sy == currentDropPiece.yPos))){
			        var tmp = {xPos:currentPiece.xPos,yPos:currentPiece.yPos};
			        currentPiece.xPos = currentDropPiece.xPos;
			        currentPiece.yPos = currentDropPiece.yPos;
			        currentDropPiece.xPos = tmp.xPos;
			        currentDropPiece.yPos = tmp.yPos;
			    }
			    resetPuzzleAndCheckWin();
			}

			function resetPuzzleAndCheckWin(){
			    stage.clearRect(0,0,puzzleWidth,puzzleHeight);
			    var gameWin = true;
			    var i;
			    var piece;
			    for(i = 0;i < pieces.length;i++){
			        piece = pieces[i];
			        stage.drawImage(img, piece.sx * scope.originalToScaledWidthRatio, piece.sy * scope.originalToScaledHeightRatio, scope.originalPieceWidth, scope.originalPieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
			        if(!scope.enableSticky) {
			        	stage.strokeRect(piece.xPos, piece.yPos, pieceWidth,pieceHeight);
			        }
			        if(piece.xPos != piece.sx || piece.yPos != piece.sy){
			        	stage.strokeRect(piece.xPos, piece.yPos, pieceWidth,pieceHeight);
			            gameWin = false;
			        }
			    }
			    if(gameWin){
			        setTimeout(gameOver,100);
			    }
			}

			function gameOver(){
				canvas.onpointerdown = null;
			    document.onpointermove = null;
			    document.onpointerup = null;
			    
			    canvas.ontouchstart = null;
			    document.ontouchmove = null;
			    document.ontouchend = null;
			    
			    scope.finished(true);
			}
			
			scope.finished = function() {
				scope.hasPuzzleStarted = false;
				scope.hasPuzzleFinished = true;
				extend();
				scope.finishedCallback();
			}

			scope.showNext = function() {
				scope.currentPuzzle = scope.currentPuzzle + 1;
				scope.hasPuzzleStarted = false;
				scope.hasPuzzleFinished = false;
				scope.hasPuzzleLoaded = false;
				init();
			}
			
			scope.start = function() {
				scope.hasPuzzleFinished = false;
				scope.hasPuzzleStarted = true;
				scope.hasLevelStarted = true;
				extend();
				shufflePuzzle();
			}
			
			function extend() {
				angular.extend(scope.fnc, {
					showNext: scope.showNext,
					start: scope.start,
					finished: scope.finished,
					hasLevelStarted: scope.hasLevelStarted,
					hasLevelFinished: scope.hasLevelFinished,
					hasPuzzleStarted: scope.hasPuzzleStarted,
					hasPuzzleFinished: scope.hasPuzzleFinished,
					hasPuzzleLoaded: scope.hasPuzzleLoaded,
					currentPuzzle: scope.currentPuzzle
				});
				scope.$evalAsync();
			}
			

		}
	};	
})();