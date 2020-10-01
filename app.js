// ===========
// Variables
// ===========
var gameTracker = {
    currentPlayerTurn: 1,
    moveLocations: [],
}

var scoreboard = {
    playerOne: 0,
    playerTwo: 0,
    draw: 0,
}

var uiSelectors = {
    gameGrid: document.querySelector('.grid'),
    boxes: document.querySelectorAll('.box'),
    playerOne: document.querySelector('.player-one'),
    playerTwo: document.querySelector('.player-two'),
    winnerMessage: document.querySelector('.winner'),
    scoreboard: {
        playerOne: document.querySelector('.score-p1'),
        playerTwo: document.querySelector('.score-p2'),
        draw: document.querySelector('.score-draw'),
    },
}

// ===========
// Functions
// ===========

function countEmptyItemsInArray(arr) {
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] === "undefined") {
            count++;
        }
    }

    return count;
}

function getPlayerMoveGridLocation(event) {
    // Returns the data attribute which refers to the boxes position in the grid on frontend.
    var gridId = event.target.dataset.gridPostion;
    return gridId;
}


function itemIsEqualToFirst(element, index, arr) {
    // Callback function: checks all items in array are the same as first but not undefined. Returns boolean.
    return arr[0] === element && element !== undefined;
  }


function checkEachItemIsTheSame(arrrayOfArrays) {
    // Loops through an array of array. For each array it checks if every is equal to first and not undefined.
    for (var i = 0; i < arrrayOfArrays.length; i++) {
        if ( arrrayOfArrays[i].every(itemIsEqualToFirst) ) {
            return {isWinner: true, player: arrrayOfArrays[i][0]};
        }
    }
    
    return {isWinner: false, player: null};
}


function checkForResult(arr) {
    // returns true if there's a winner otherwise false.
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

    return checkEachItemIsTheSame(winConditions);
}



/// Need to clean up below
function makePlayerMove(event) {
    if (gameTracker.currentPlayerTurn === 1) {
        event.target.textContent = 'X'; // Apply X to grid
    } else {
        event.target.textContent = 'O'; // Apply O to grid
    }
    event.target.classList.toggle('no-clicks') // prevent a second click on same box
    gameTracker.moveLocations[getPlayerMoveGridLocation(event)] = gameTracker.currentPlayerTurn; // add move to game data structure
}

function switchPlayerTurn(event) {
    uiSelectors.playerOne.classList.toggle('player-active') // switch player turn in UI (front end)
    uiSelectors.playerTwo.classList.toggle('player-active')
    if (gameTracker.currentPlayerTurn === 1) {
        gameTracker.currentPlayerTurn = 2; // switch turn in game logic (backend)  
    } else {
        gameTracker.currentPlayerTurn = 1;
    }
}

function updateScorecard(result) {
    if (result.player === 1) {
        scoreboard.playerOne += 1;
        uiSelectors.scoreboard.playerOne.textContent = scoreboard.playerOne;
    } else {
        scoreboard.playerTwo += 1;
        uiSelectors.scoreboard.playerTwo.textContent = scoreboard.playerTwo;
    }
}

function checkForDraw() {
    var allPossibleMovesMade = countEmptyItemsInArray(gameTracker.moveLocations) === 0;
    var allPositionsEvaluated = gameTracker.moveLocations.length === 9;

    if (allPositionsEvaluated && allPossibleMovesMade) {
        uiSelectors.winnerMessage.textContent = "It's a draw"
        scoreboard.draw += 1;
        uiSelectors.scoreboard.draw.textContent = scoreboard.draw;
        uiSelectors.gameGrid.classList.toggle('no-clicks')
    } 
}

function evaluateGameResult(event) {
    result = checkForResult(gameTracker.moveLocations);
    // check if a win condition has been met.
    if (result.isWinner) {
        // if yes,
            // update UI with who won and prevent more clicks
            // Update scorecard on backend and UI
        uiSelectors.gameGrid.classList.toggle('no-clicks');
        uiSelectors.winnerMessage.textContent = `The winner is: Player ${result.player}`;
        updateScorecard(result);
    } else {
        // Otherwise,
            // check for a draw
            // if it is draw update UI and prevent more clicks
            // Update scorecard on backend and UI    
        checkForDraw() 
    }
}



function gameController(event) {
    makePlayerMove(event)

    switchPlayerTurn(event)

    evaluateGameResult(event)
}


uiSelectors.boxes.forEach(elem => elem.addEventListener('click', gameController)) 