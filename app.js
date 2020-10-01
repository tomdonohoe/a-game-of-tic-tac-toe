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
    resetBtn: document.querySelector('.reset-btn'),
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


function checkEachItemIsTheSame(arr) {
    // Loops through an array of array. For each array it checks if every is equal to first and not undefined.
    for (var i = 0; i < arr.length; i++) {
        if ( arr[i].condition.every(itemIsEqualToFirst) ) {
            return {isWinner: true, player: arr[i].condition[0], winningIndexCombo: arr[i].indexCombo};
        }
    }
    
    return {isWinner: false, player: null, winningIndexCombo: null};
}


function checkForResult(arr) {
    // returns true if there's a winner otherwise false.
    var winConditions = [
        {condition: [arr[0], arr[1], arr[2]], indexCombo: [0, 1, 2]},
        {condition: [arr[0], arr[3], arr[6]], indexCombo: [0, 3, 6]},
        {condition: [arr[0], arr[4], arr[8]], indexCombo: [0, 4, 8]},
        {condition: [arr[1], arr[4], arr[7]], indexCombo: [1, 4, 7]},
        {condition: [arr[2], arr[5], arr[8]], indexCombo: [2, 5, 8]},
        {condition: [arr[2], arr[4], arr[6]], indexCombo: [2, 4, 6]},
        {condition: [arr[3], arr[4], arr[5]], indexCombo: [3, 4, 5]},
        {condition: [arr[6], arr[7], arr[8]], indexCombo: [6, 7, 8]},

        // [ [arr[0], arr[1], arr[2] ],
        // [ arr[0], arr[3], arr[6] ],
        // [ arr[0], arr[4], arr[8] ],
        // [ arr[1], arr[4], arr[7] ],
        // [ arr[2], arr[5], arr[8] ],
        // [ arr[2], arr[4], arr[6] ],
        // [ arr[3], arr[4], arr[5] ],
        // [ arr[6], arr[7], arr[8] ]
    ];

    return checkEachItemIsTheSame(winConditions);
}



/// Need to clean up below
function makePlayerMove(event) {
    if (gameTracker.currentPlayerTurn === 1) {
        event.target.firstElementChild.src = "images/cross.png"
        event.target.firstElementChild.classList.remove('hidden')
        // event.target.textContent = 'X'; // Apply X to grid
    } else {
        // event.target.textContent = 'O'; // Apply O to grid
        event.target.firstElementChild.src = "images/circle.png"
        event.target.firstElementChild.classList.remove('hidden')
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

        return true
    }

    return false;
}

function highlightWinningComboInUI(result) {
    uiSelectors.boxes[result.winningIndexCombo[0]].classList.add('light-green-bgc')
    uiSelectors.boxes[result.winningIndexCombo[1]].classList.add('light-green-bgc')
    uiSelectors.boxes[result.winningIndexCombo[2]].classList.add('light-green-bgc')
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
        highlightWinningComboInUI(result);
        return true;
    } else {
        // Otherwise,
            // check for a draw
            // if it is draw update UI and prevent more clicks
            // Update scorecard on backend and UI    
        return checkForDraw(); 
    }
}

function resetGame() {
    gameTracker.currentPlayerTurn = 1;
    gameTracker.moveLocations = [];
    uiSelectors.playerOne.classList.add('player-active')
    uiSelectors.playerTwo.classList.remove('player-active')
    uiSelectors.gameGrid.classList.remove('no-clicks')
    uiSelectors.winnerMessage.textContent = ''
    for (var i = 0; i < uiSelectors.boxes.length; i++) {
        uiSelectors.boxes[i].classList.remove('no-clicks')
        uiSelectors.boxes[i].firstElementChild.src = ""
        uiSelectors.boxes[i].firstElementChild.classList.add('hidden')
        uiSelectors.boxes[i].classList.remove('light-green-bgc')
    }
    uiSelectors.resetBtn.classList.add('hidden')
}


function givePlayAgainOption() {
    uiSelectors.resetBtn.classList.remove('hidden')
}


function gameController(event) {
    makePlayerMove(event)

    switchPlayerTurn(event)

    if (evaluateGameResult(event)) {
        givePlayAgainOption()
    }
}


uiSelectors.boxes.forEach(elem => elem.addEventListener('click', gameController)) 
uiSelectors.resetBtn.addEventListener('click', resetGame)