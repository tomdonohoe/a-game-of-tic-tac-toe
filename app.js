var boxes = document.querySelectorAll('.box');
var playerOne = document.querySelector('.player-one');
var playerTwo = document.querySelector('.player-two');
var winnerMessage = document.querySelector('.winner');

var player = 1;
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

function handleClick(event) {
    console.log(player)
    if (player === 1) {
        event.target.textContent = 'X'
        playerOne.classList.toggle('player-active')
        playerTwo.classList.toggle('player-active')
        game[getGridPosition(event)] = player;
        player = 2;
        if (checkForWinner(game).winner) {
            winnerMessage.textContent = `The winner is: Player ${checkForWinner(game).player}`
        }
    } else {
        event.target.textContent = 'O'
        playerOne.classList.toggle('player-active')
        playerTwo.classList.toggle('player-active')
        game[getGridPosition(event)] = player;
        player = 1;
        if (checkForWinner(game).winner) {
            winnerMessage.textContent = `The winner is: Player ${checkForWinner(game).player}`
        }
    }
}


boxes.forEach(elem => elem.addEventListener('click', handleClick)) 