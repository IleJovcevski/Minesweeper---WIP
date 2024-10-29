/**
 * Timer logic - starts and restarts the timer
 * @returns Timer logic
 */
var Timer = function() {
    var time = {};
    let seconds = 0;
    let digits = "";
    let completionTime = "000";
    let toggle = false;
    let stopped = false;
    var timerElement = document.getElementById('timer');

    /**
     * Increments seconds and converts them to string
     */
    time.incrementSeconds = function() {
        if (!stopped) {
            if (toggle) {   
                seconds += 1;
                if (seconds < 10) {
                    digits = "00" + seconds;
                } else if (seconds < 100) {
                    digits = "0" + seconds;
                } else {
                    digits = seconds;
                }
                timerElement.innerText = digits;
            } else {
                seconds = 0;
                timerElement.innerText = "000";
            }
        }
    }

    /**
     * Resets the seconds to 0
     */
    time.reset = function() {
        /*if (!toggle) {*/
            seconds = 0;
            digits = "";
            stopped = false;
            completionTime = "";
            toggle = false;
            timerElement.innerText = "000";
        /*}*/
    }

    /**
     * Toggles the time switch
     */
    time.switchToggle = function() {
        toggle = !toggle;
    }

    /**
     * Stops the timer
     */
    time.stop = function() {
        completionTime = digits;
        stopped = true;
        time.switchToggle();
        if (!completionTime) {
            completionTime = '000';
        }
        timerElement.innerText = completionTime;
    }

    return time;
}

/**
 * Handle File dropdown
 */
var openFileDropdown = function() {
    document.getElementById("fileDropdown").classList.toggle("show");
}

/**
 * Menages the usage of flags
 * @returns Flags logic
 */
var Flags = function() {
    var minesElement = document.getElementById("mines-left");
    let mines = 10;
    let minesString = "";
    let flaggedArray = new Array(81);
    flaggedArray.fill(false);
    var flags = {};

    /**
     * checks current state and adds or removes a flag
     * @param {current state} present 
     */
    flags.addFlag = function(present) {
        if (present.className === 'flagged') {
            mines++;
        } else {
            mines--
        }
        flags.convertToString(mines);
        minesElement.innerText = minesString;
    }

    flags.resetFlags = function() {
        mines = 10;
        flags.convertToString(mines);
        minesElement.innerText = minesString;
    }

    /**
     * Converts number of flags to a 3 digit string
     * @param {current number of flags} number 
     */
    flags.convertToString = function(number) {
        if (number < -9) {
            minesString = "-" + Math.abs(number);
        } else if (number < 0) {
            minesString = "-0" + Math.abs(number);
        } else if (number < 10) {
            minesString = "00" + number;
        } else {
            minesString = "0" + number;
        }
    }

    flags.setCounterToZero = function() {
        minesElement.innerText = "000";
    }

    return flags;
}

/**
 * Minefiled logic
 * @returns Minefiled
 */
var Minefield = function() {
    var field = {};
    let mines = new Set();
    let matrix = [];

    /**
     * Generates a set of mines
     */
    field.generateMines = function() {
        while (mines.size < 10) {
            let mineOrder = Math.floor(Math.random() * 81);
            mines.add(mineOrder);
        }
    }

    /**
     * Generates a 9x9 matrix
     */
    field.generateField = function() {
        for (let i = 0; i < 9; i++) {
            matrix[i] = [];
            for (let j = 0; j < 9; j++) {
                matrix[i][j] = '0';
            }
        }
    }

    /**
     * populates the matrix with the generated mines
     */
    field.populateMines = function() {
        field.generateMines();
        field.generateField();
        let orderedMines = Array.from(mines);
        orderedMines.sort((a, b) => a - b); /*puts the mines set in and ordered array for ease of debugging*/
        for (let m = 0; m < orderedMines.length; m++) {
            let h = Math.floor(orderedMines[m] / 9);
            let v = orderedMines[m] % 9;
            matrix[h][v] = 'm';
        }
    }

    /**
     * Maps the neigbours of mines
     */
    field.mapNeighbour = function() {
        field.populateMines();
        field.mapFirstCorner(matrix);
        field.mapSecondCorner(matrix);
        field.mapThirdCorner(matrix);
        field.mapFourthCorner(matrix);
        field.mapUpper(matrix);
        field.mapLower(matrix);
        field.mapLeft(matrix);
        field.mapRight(matrix);
        field.mapCore(matrix);
    }

    /**
     * Maps the upper left corner
     * @param {the generated mines matrix} matrix 
     */
    field.mapFirstCorner = function(matrix) {
        if (matrix[0][0] !== 'm') {
            let neighbourMines = 0;
            if (matrix[0][1] === 'm') {neighbourMines++}
            if (matrix[1][0] === 'm') {neighbourMines++}
            if (matrix[1][1] === 'm') {neighbourMines++}
            matrix[0][0] = neighbourMines.toString();
        }
    }

    /**
     * Maps the upper right corner
     * @param {the generated mines matrix} matrix 
     */
    field.mapSecondCorner = function(matrix) {
        if (matrix[0][8] !== 'm') {
            let neighbourMines = 0;
            if (matrix[0][7] === 'm') {neighbourMines++}
            if (matrix[1][7] === 'm') {neighbourMines++}
            if (matrix[1][8] === 'm') {neighbourMines++}
            matrix[0][8] = neighbourMines.toString();
        }
    }

    /**
     * Maps the lower left corner
     * @param {the generated mines matrix} matrix 
     */
    field.mapThirdCorner = function(matrix) {
        if (matrix[8][0] !== 'm') {
            let neighbourMines = 0;
            if (matrix[7][0] === 'm') {neighbourMines++}
            if (matrix[7][1] === 'm') {neighbourMines++}
            if (matrix[8][1] === 'm') {neighbourMines++}
            matrix[8][0] = neighbourMines.toString();
        }
    }

    /**
     * Maps the lower right corner
     * @param {the generated mines matrix} matrix 
     */
    field.mapFourthCorner = function(matrix) {
        if (matrix[8][8] !== 'm') {
            let neighbourMines = 0;
            if (matrix[7][7] === 'm') {neighbourMines++}
            if (matrix[7][8] === 'm') {neighbourMines++}
            if (matrix[8][7] === 'm') {neighbourMines++}
            matrix[8][8] = neighbourMines.toString();
        }
    }

    /**
     * Maps the upper edge
     * @param {the generated mines matrix} matrix 
     */
    field.mapUpper = function(matrix) {
        for (let x = 1; x < 8; x++) {
            if (matrix[0][x] !== 'm') {
                let neighbourMines = 0;
                if (matrix[0][x-1] === 'm') {neighbourMines++}
                if (matrix[1][x-1] === 'm') {neighbourMines++}
                if (matrix[1][x] === 'm') {neighbourMines++}
                if (matrix[1][x+1] === 'm') {neighbourMines++}
                if (matrix[0][x+1] === 'm') {neighbourMines++}
                matrix[0][x] = neighbourMines.toString();
            }
        }
    }

    /**
     * Maps the lower edge
     * @param {the generated mines matrix} matrix 
     */
    field.mapLower = function(matrix) {
        for (let x = 1; x < 8; x++) {
            if (matrix[8][x] !== 'm') {
                let neighbourMines = 0;
                if (matrix[8][x-1] === 'm') {neighbourMines++}
                if (matrix[7][x-1] === 'm') {neighbourMines++}
                if (matrix[7][x] === 'm') {neighbourMines++}
                if (matrix[7][x+1] === 'm') {neighbourMines++}
                if (matrix[8][x+1] === 'm') {neighbourMines++}
                matrix[8][x] = neighbourMines.toString();
            }
        }
    }

    /**
     * Maps the left edge
     * @param {the generated mines matrix} matrix 
     */
     field.mapLeft = function(matrix) {
        for (let y = 1; y < 8; y++) {
            if (matrix[y][0] !== 'm') {
                let neighbourMines = 0;
                if (matrix[y-1][0] === 'm') {neighbourMines++}
                if (matrix[y-1][1] === 'm') {neighbourMines++}
                if (matrix[y][1] === 'm') {neighbourMines++}
                if (matrix[y+1][1] === 'm') {neighbourMines++}
                if (matrix[y+1][0] === 'm') {neighbourMines++}
                matrix[y][0] = neighbourMines.toString();
            }
        }
    }

    /**
     * Maps the right edge
     * @param {the generated mines matrix} matrix 
     */
     field.mapRight = function(matrix) {
        for (let y = 1; y < 8; y++) {
            if (matrix[y][8] !== 'm') {
                let neighbourMines = 0;
                if (matrix[y-1][8] === 'm') {neighbourMines++}
                if (matrix[y-1][7] === 'm') {neighbourMines++}
                if (matrix[y][7] === 'm') {neighbourMines++}
                if (matrix[y+1][7] === 'm') {neighbourMines++}
                if (matrix[y+1][8] === 'm') {neighbourMines++}
                matrix[y][8] = neighbourMines.toString();
            }
        }
    }

    /**
     * Maps the core
     * @param {the generated mines matrix} matrix 
     */
    field.mapCore = function(matrix) {
        for (let y = 1; y < 8; y++) {
            for (let x = 1; x < 8; x++) {
                if (matrix[y][x] !== 'm') {
                    let neighbourMines = 0;
                    if (matrix[y-1][x] === 'm') {neighbourMines++}
                    if (matrix[y-1][x+1] === 'm') {neighbourMines++}
                    if (matrix[y][x+1] === 'm') {neighbourMines++}
                    if (matrix[y+1][x+1] === 'm') {neighbourMines++}
                    if (matrix[y+1][x] === 'm') {neighbourMines++}
                    if (matrix[y+1][x-1] === 'm') {neighbourMines++}
                    if (matrix[y][x-1] === 'm') {neighbourMines++}
                    if (matrix[y-1][x-1] === 'm') {neighbourMines++}
                    matrix[y][x] = neighbourMines.toString();
                }
            }
        }
    }

    /**
     * Returns the minefield
     * @returns the mapped mines matrix
     */
    field.getMineField = function() {
        field.mapNeighbour();
        return matrix;
    }

    return field;
}

/**
 * Helper functions
 */

/**
 * Smiley manipulations
 */
function smileyExcited() {
    setTimeout(() => {
        let smiley = document.getElementById('button');
        addAnotherClass(smiley, 'excited');
    }, 100)
}

function smileyNormal() {
    setTimeout(() => {
        let smiley = document.getElementById('button');
        removeClass(smiley, 'excited');
    }, 400);
}

/**
 * Cheks of the element has the class
 * @param {doc element} element 
 * @param {class we are checking} clas 
 * @returns 
 */
function hasClass(element, clas) {
    return element.className.match(new RegExp('(\\s|^)' + clas + '(\\s|$)'));
}

/**
 * Adds a class to an element
 * @param {doc element} element 
 * @param {class we are adding} clas 
 */
function addClass(element, clas) {
    if (!hasClass(element, clas))
        element.className = clas;
}

/**
 * Adds another class to an element
 * @param {doc element} element 
 * @param {class we are adding} clas 
 */
function addAnotherClass(element, clas) {
    /*if (hasClass(element, clas)) {*/
        element.className += " " + clas;
    /*}*/
}

/**
 * Scan for unrevealed cells
 */
function scanForUnrevealed(flags) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let id = i + '-' + j;
            let cell = document.getElementById(id);
            if (hasClass(cell, 'cell')) {
                removeClass(cell, 'cell');
                addClass(cell, 'flagged');
                flags.setCounterToZero();
                /*theFlags.addFlag(cell);*/
            }
        }
    }
}

/**
 * Removes a class from an element
 * @param {doc element*} element 
 * @param {the class we are removing} clas 
 */
function removeClass(element, clas) {
    if (hasClass(element, clas)) {
        var reg = new RegExp('(\\s|^)' + clas + '(\\s|$)');
        element.className = element.className = 'cell';
    }
}

/**
 * Handles the left-click on a cell
 * @param {a cell from the table} cell 
 */
function lHandler(cell, timer, game) {
    let classes = cell.className.split(' ');
    if (classes[0] === 'flagged') {
		return;
    } else {
        if (hasClass(cell, 'cell')) {
            addClass(cell, 'revealed');
        }
        if (cell.innerText === '1') {
            addAnotherClass(cell, 'one');
        } 
        else if (cell.innerText === '2') {
            addAnotherClass(cell, 'two');
        } 
        else if (cell.innerText === '3') {
            addAnotherClass(cell, 'three');
        }
        else if (cell.innerText === '4') {
            addAnotherClass(cell, 'four');
        }
        else if (cell.innerText === '5') {
            addAnotherClass(cell, 'five');
        }
        else if (cell.innerText === '6') {
            addAnotherClass(cell, 'six');
        }
        else if (cell.innerText === '7') {
            addAnotherClass(cell, 'seven');
        }
        else if (cell.innerText === '8') {
            addAnotherClass(cell, 'eight');
        }
        else if (cell.innerText === 'm') {
            addAnotherClass(cell, 'mine');
            timer.stop();
            setTimeout(() => {
                game.toggleAlive();
            }, 500)
            let puzzle = document.getElementById('table');
            addAnotherClass(puzzle, 'game-over');
        }
        else {
            let x = parseInt(cell.id[0]);
            let y = parseInt(cell.id[2]);
            floodFill(x, y, game);
        }
    
    }
    
}

/**
 * Floodfill checks cells for zeros
 * @param {row} x 
 * @param {column} y 
 * @returns void
 */
function floodFill(x , y, game) {
    let id = x + '-' + y;
    let cell = document.getElementById(id);
    
    if (x < 0 || x > 8 || y < 0 || y > 8) {
        return;
    }
    if (cell.innerText === 'm') {
        return;
    }
    if (hasClass(cell, 'cell')) {
        game.increaseReveals();
    }
    if (cell.innerText === '1') {
        removeClass(cell, 'class');
        addClass(cell, 'revealed visited one');
        return;
    }
    if (cell.innerText === '2') {
        removeClass(cell, 'class');
        addClass(cell, 'revealed visited two');
        return;
    }
    if (cell.innerText === '3') {
        removeClass(cell, 'class');
        addClass(cell, 'revealed visited three');
        return;
    }
    if (cell.innerText === '4') {
        removeClass(cell, 'class');
        addClass(cell, 'revealed visited four');
        return;
    }
    if (cell.innerText === '5') {
        removeClass(cell, 'class');
        addClass(cell, 'revealed visited five');
        return;
    }
    if (cell.innerText === '6') {
        removeClass(cell, 'class');
        addClass(cell, 'revealed visited six');
        return;
    }
    if (cell.innerText === '7') {
        removeClass(cell, 'class');
        addClass(cell, 'revealed visited seven');
        return;
    }
    if (cell.innerText === '8') {
        removeClass(cell, 'class');
        addClass(cell, 'revealed visited eight');
        return;
    }
    if (hasClass(cell, 'visited')) {
        return;
    }
    removeClass(cell, 'class');
    addClass(cell, 'revealed');
    addAnotherClass(cell, 'visited');
    addAnotherClass(cell, 'zero');
    floodFill(x - 1 , y, game);
    floodFill(x - 1 , y + 1, game);
    floodFill(x , y + 1, game);
    floodFill(x + 1 , y + 1, game);
    floodFill(x + 1 , y, game);
    floodFill(x + 1 , y - 1, game);
    floodFill(x , y - 1, game);
    floodFill(x - 1, y - 1, game);
}

/**
 * Handles the context menu click
 * @param {order of the cell*} order 
 * @param {the field cell} cell 
 * @param {the class we want to add} newClass 
 */
function handler(cell, newClass, flags) {
	if (hasClass(cell, 'revealed')) return;
    flags.addFlag(cell);
    if (!hasClass(cell, newClass)) {
        addClass(cell, newClass);
    } else {
        removeClass(cell, newClass);
    }
}

/**
 * Manages a new game
 */
var NewGame = function(flags) {
    var game = {};
    let running = false;
    let reveals = 0;
    let alive = true;
    let won = false;

    /**
     * Create a new game
     */
    game.create = function() {
        if (running) {
            aTimer.switchToggle();
            running = false;
        }
        aTimer.reset();
        flags.resetFlags();
        reveals = 0;
        alive = true;
        let myButton = document.getElementById('button');
        removeClass(myButton, 'dead');
        let puzzle = document.getElementById('table');
        removeClass(puzzle, 'game-over')
        addClass(puzzle, 'puzzle');
        won = false;
        if (hasClass(myButton, 'won')) {
            removeClass(myButton, 'won');
        }
        var aMineField = new Minefield();
        var aTable = new MakeTable(aMineField, aGame);
        document.getElementById("fileDropdown").classList.remove("show");
        return aTable;
    }

    /**
     * Start a new game
     */
    game.start = function() {
        running = true;
        aTimer.incrementSeconds();
    }

    /**
     * Reveal a sqaure
     */
    game.reveal = function(cell) {
        let classes = cell.className.split(' ');
        if (!running) {
            game.start();
            aTimer.switchToggle();
        }
        if (classes[0] === 'cell') {
            game.increaseReveals(cell);
        }
        lHandler(cell, aTimer, aGame);
        if (reveals >= 71) {
            scanForUnrevealed(flags);
            aTimer.stop();
            won = true;
            setTimeout(() => {
                let myButton = document.getElementById('button');
                addClass(myButton, 'won');
            }, 600)
            let puzzle = document.getElementById('table');
            addAnotherClass(puzzle, 'game-over');
        }
    }

    /**
     * Helper methods for reveals manipulations
     */
    game.increaseReveals = function(cell) {
        reveals++;
    }
    game.decreaseReveals = function() {
        reveals--;
    }

    /**
     * Toggles between alive an not alive
     */
    game.toggleAlive = function() {
        alive = !alive;
        let myButton = document.getElementById('button');
        if (!alive) {
            addClass(myButton, 'dead');
        } else {
            removeClass(myButton, 'dead');
        }
    }
    
    
    return game;
}

/**
 * Generates a table of a minefield
 * @param {a matrix of mines and neighbours} minefield 
 * @returns a table
 */
var MakeTable = function(minefield, game) {
    var table = document.getElementById('table');
    table.innerHTML = "";
    let inputArray = minefield.getMineField();
    for (var i = 0; i < inputArray.length; i++) {
        let row = document.createElement("tr");
        for (var j = 0; j < inputArray[i].length; j++) {
            let cell = document.createElement("td");
            let value = document.createElement("div");
            value.innerText = inputArray[i][j];
            cell.appendChild(value);
            cell.classList.add("cell");
            cell.setAttribute('id', i + ('-') + j)
            cell.addEventListener("click", function() {
                game.reveal(cell);
            });
            cell.addEventListener("contextmenu", function(){
                handler(cell, 'flagged', theFlags)
            });
            cell.addEventListener("mousedown", smileyExcited);
            cell.addEventListener("mouseup", smileyNormal);
            cell.style.userSelect = 'none';
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    return table;
}

var aTimer = new Timer();
var theFlags = new Flags();
var delay = setInterval(aTimer.incrementSeconds, 1000);
var aMineField = new Minefield();
var aGame = new NewGame(theFlags);
var aTable = new MakeTable(aMineField, aGame);