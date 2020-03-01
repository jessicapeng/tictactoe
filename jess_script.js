var board; //board that contains list of lists
const user = 'X'; //user player 
const computer = 'O'; //computer player 
const winCombos = [  //combination of wins stored here
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell'); //creates list from 0-9
startGame();

function startGame() {
	document.getElementById("moves").innerHTML = "Your moves will be displayed below: ";

	document.getElementById("turn").innerHTML ='Welcome to my game of tic tac toe!'
	//document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, user)
		if (!checkWin(origBoard, user) && !checkTie()) turn(bestSpot(), computer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	
	displayMove(player, squareId);

	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

//displays the move on the bottom of the user and computer
function displayMove(player, id)
{
	if(player == 'X')
	{
		name = 'Computer';
	}
	else
	{
		name = 'You';
	}
	if (id == '0'){pos = "11";}
    if (id == '1'){pos = "12";}
    if (id == '2'){pos = "13";}
    if (id == '3'){pos = "21";}
    if (id == '4'){pos = "22";}
    if (id == '5'){pos = "23";}
    if (id == '6'){pos = "31";}
    if (id == '7'){pos = "32";}
	if (id == '8'){pos = "33";}
	
	orig = document.getElementById("moves").innerHTML;
	document.getElementById("moves").innerHTML = orig + '<br/> - ' + name + ' chose row ' + pos[0] + ' and col ' + pos[1];

}

//checks if there is a win in the game
function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

//tells user that the game is over and who won/lost/tie
function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == user ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == user ? "You won! Congratulations!" : "Oh, no! You lost. Better luck next time!");
	if (gameWon.player == user)
	{
		setTimeout(function(){ alert('You won! Congratulations!'); }, 500);
	}
	else
	{
		setTimeout(function(){ alert('Oh no! You lost. Better luck next time!'); }, 500);
	}
}

//declares the winner
function declareWinner(who) {
	document.getElementById("turn").innerHTML = who;

}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, computer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		alert('The game ended in a Tie!');
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, user)) {
		return {score: -10};
	} else if (checkWin(newBoard, computer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == computer) {
			var result = minimax(newBoard, user);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, computer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === computer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}