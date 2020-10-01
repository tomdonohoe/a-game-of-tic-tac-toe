var gameGrid = document.querySelector('.grid');
var boxes = document.querySelectorAll('.box');
var playerOne = document.querySelector('.player-one');
var playerTwo = document.querySelector('.player-two');
var winnerMessage = document.querySelector('.winner');
var playerOneScore = document.querySelector('.score-p1');
var playerTwoScore = document.querySelector('.score-p2');
var draw = document.querySelector('.score-draw');

var player = 1;

var scoreboard = {
    playerOne: 0,
    playerTwo: 0,
    draw: 0,
}

var game = [];


function getGridPosition(event) {
    var gridId = event.target.dataset.gridPostion;
    return gridId
}

function isTrue(element) {
    return element === true;
}


function areAllEqual(arr) {
    var areEqualGroups = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[0] === arr[i] && arr[i] !== undefined) {
            areEqualGroups.push(true);
        } else {
            areEqualGroups.push(false);
        }
    }

    return areEqualGroups.every(isTrue)
}


function checkForWinner(arr) {
    var winConditions = [
        [ arr[0], arr[1], arr[2] ],
        [ arr[0], arr[3], arr[6] ],
        [ arr[0], arr[4], arr[8] ],
        [ arr[1], arr[4], arr[7] ],
        [ arr[2], arr[5], arr[8] ],
        [ arr[2], arr[4], arr[6] ],
        [ arr[3], arr[4], arr[5] ],
        [ arr[6], arr[7], arr[8] ]
    ];

    for (var i = 0; i < winConditions.length; i++) {
        if (areAllEqual(winConditions[i])) {
            return {winner: areAllEqual(winConditions[i]), player: winConditions[i][0]}
        }
    }
    return {winner: false, player: null}
}

function countEmptyArr(arr) {
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] === "undefined") {
            count++;
        }
    }

    return count;
}

function handleClick(event) {
    console.log(player)
    if (player === 1) {
        event.target.textContent = 'X' // Apply X to grid
        event.target.classList.toggle('no-clicks') // prevent a second click on same box
        playerOne.classList.toggle('player-active') // switch player turn in UI (front end)
        playerTwo.classList.toggle('player-active')
        game[getGridPosition(event)] = player; // add move to game data structure
        player = 2; // switch turn in game logic (backend)
        if (checkForWinner(game).winner) { // check for winner
            winnerMessage.textContent = `The winner is: Player ${checkForWinner(game).player}`
            scoreboard.playerOne += 1;
            playerOneScore.textContent = scoreboard.playerOne;
            gameGrid.classList.toggle('no-clicks')
        } else {
            if (game.length  === 9 && countEmptyArr(game) === 0) {
                winnerMessage.textContent = "It's a draw"
                scoreboard.draw += 1;
                draw.textContent = scoreboard.draw;
                gameGrid.classList.toggle('no-clicks')
            }
        } 
    } else {
        event.target.textContent = 'O'
        event.target.classList.toggle('no-clicks')
        playerOne.classList.toggle('player-active')
        playerTwo.classList.toggle('player-active')
        game[getGridPosition(event)] = player;
        player = 1;
        if (checkForWinner(game).winner) {
            winnerMessage.textContent = `The winner is: Player ${checkForWinner(game).player}`
            scoreboard.playerTwo += 1;
            playerTwoScore.textContent = scoreboard.playerTwo;
            gameGrid.classList.toggle('no-clicks')
        } else {
            if (game.length  === 9 && countEmptyArr(game) === 0) {
                winnerMessage.textContent = "It's a draw"
                scoreboard.draw += 1;
                draw.textContent = scoreboard.draw;
                gameGrid.classList.toggle('no-clicks')
            }
        } 
    }
}


boxes.forEach(elem => elem.addEventListener('click', handleClick)) 