//Stage 5.1
class MyApp {
    possibleCreatureArray = [`zouwu`, `swooping`, `salamander`, `puffskein`, `kelpie`];

    firstClick = true;
    secondClick = false;

    selectedAddress = [];
    neighborAddress = [];
    topNeighbor     = [];
    rightNeighbor   = [];
    botNeighbor     = [];
    leftNeighbor    = [];

    constructor() {
        this.rowsCount = 0;
        this.colsCount = 0;
        this.mapElement = document.getElementById('map');
        this.gameArray = [];
    }

    reset() {
        this.firstClick = true;
        this.secondClick = false;

        this.selectedAddress = 0;
        this.neighborAddress = 0;

        this.leftNeighbor = 0;
        this.rightNeighbor = 0;
        this.topNeighbor = 0;
        this.botNeighbor = 0;
    }


    renderMap(rowsCount, colsCount) {
        this.rowsCount = rowsCount;
        this.colsCount = colsCount;

        for (let r = 0; r < this.rowsCount; r++) {
            const trElement = document.createElement('tr');
            for (let c = 0; c < this.colsCount; c++) {
                const tdElement = document.createElement('td');
                tdElement.classList.add('cell');
                tdElement.textContent = `${r} - ${c}`;
                tdElement.addEventListener('click', () =>{
                    if (this.secondClick) {
                        return;
                    }
                    if (this.firstClick) {
                        this.firstClick = !this.firstClick
                        this.selectedAddress = [r, c];

                        tdElement.classList.add("cell-selected");
                    } else {
                        let matchArray = [];
                        this.neighborAddress = [r, c];
                        if (this.isNeighbor(this.selectedAddress, this.neighborAddress)) {
                            this.secondClick = !this.secondClick

                            console.log("before "+ this.gameArray[this.selectedAddress[0]][this.selectedAddress[1]]);
                            console.log("before "+ this.gameArray[this.neighborAddress[0]][this.neighborAddress[1]]);

                            // Swap Creatures
                            this.creatureSwap(this.selectedAddress, this.neighborAddress)
                            // After swap, check if there is a match
                            let matchFound = this.matchBothNeighbors(this.selectedAddress, this.neighborAddress);
                            if (matchFound) {
                                /*
                                    --- Since a match was found, We check the whole board for matches. All matches that
                                    are found are added to a "matchArray"
                                    --- On a side note: Not only do we get matching creatures for selected and neighbor.
                                    We also get any other matches that might be on the board.
                                */
                                matchArray = this.getAllMatches();
                                this.updateGameArray(matchArray);
                            } else {
                                // No match found we Swap back.
                                this.creatureSwap(this.selectedAddress, this.neighborAddress)
                            }

                            console.log("after "+ this.gameArray[this.selectedAddress[0]][this.selectedAddress[1]]);
                            console.log("after "+ this.gameArray[this.neighborAddress[0]][this.neighborAddress[1]]);

                            // note-: stage 5
                            do {
                                this.redrawMap(this.gameArray); // Populate the map with creatures.
                                // After we redraw, we check for new matches. when blanks are filled the may generate new matches
                                matchArray = this.getAllMatches();
                                this.updateGameArray(matchArray);
                            } while (matchArray.length > 0)
                        }
                    }
                })

                trElement.appendChild(tdElement);
            }
            this.mapElement.appendChild(trElement);
        }
    }

    updateGameArray(matchArray) {
        for (let r = 0; r < this.gameArray.length; r++) {

            for (let c = 0; c < this.gameArray[r].length; c++) {
                if (arrayExistsInArray([r, c], matchArray)) {
                    this.gameArray[r][c] = null;
                }
            }
        }

        function arrayExistsInArray(arrayToCheck, arrayOfArrays) {
            return arrayOfArrays.some(subArray =>
                subArray.length === arrayToCheck.length &&
                subArray.every((value, index) => value === arrayToCheck[index])
            );
        }
    }


    redrawMap(gameArray) {
        if (gameArray.length < 3) {
            return false;
        } else {
            for (let i = 0; i < gameArray.length; i++) {
                if (!Array.isArray(gameArray[i]) || gameArray[i].length < 3) {
                    return false;
                }
            }
        }

        this.gameArray = gameArray; // if good gameArray set "this"

        const table = this.mapElement;

        for (let r = 0; r < this.gameArray.length; r++)  {
            const row = table.rows[r];

            for (let c = 0; c < this.gameArray[r].length; c++)  {
                const cell = row.cells[c];

                cell.className = "cell";
                cell.innerHTML = "";

                if (this.gameArray[r][c] === null) {
                    // note-: stage 5
                    const newRandImage = this.generateRandomBeingName();
                    this.gameArray[r][c] = newRandImage;
                    cell.style.backgroundColor = "pink";
                }

                //cell.dataset.being = ""; // note-: Key line to pass Stage 4, Test #11.
                cell.dataset.being = this.gameArray[r][c];
                const imgElement = document.createElement('img');
                imgElement.src = `images/${this.gameArray[r][c]}.png`;
                imgElement.dataset.coords = `x${c}_y${r}`;
                cell.appendChild(imgElement);
            }
        }
        this.reset();
    }

    // note-: stage 5
    generateRandomBeingName() {
        const j = Math.floor(Math.random() * (this.possibleCreatureArray.length));

        return this.possibleCreatureArray[j];
    }

    clearMap() {
        this.mapElement.innerHTML = '';
    }

    creatureSwap(creature, neighbor) {
        const tempHold = this.gameArray[creature[0]][creature[1]];
        this.gameArray[creature[0]][creature[1]] = this.gameArray[neighbor[0]][neighbor[1]];
        this.gameArray[neighbor[0]][neighbor[1]] = tempHold;
    }

    isNeighbor(address, neighborAddress) {
        [this.topNeighbor, this.rightNeighbor, this.botNeighbor, this.leftNeighbor] = this.getNeighbors(address);

        const neighbors = [this.topNeighbor, this.rightNeighbor, this.botNeighbor, this.leftNeighbor];

        return isArrayIncluded(neighborAddress, neighbors);

        function isArrayIncluded(creatureAddress, neighbors) {
            return neighbors.some(item => item.length === creatureAddress.length && item.every((value, index) => value === creatureAddress[index]));
        }
    }


    getNeighbors(address) {
        let x = address[0];
        let y = address[1];

        this.topNeighbor   = [x-1, y];
        this.rightNeighbor = [x, y+1];
        this.botNeighbor   = [x+1, y];
        this.leftNeighbor  = [x, y-1];

        return [this.topNeighbor, this.rightNeighbor, this.botNeighbor, this.leftNeighbor];
    }

    /*
    Get All Matches both Vertical and Horizontal. No Diagonal matched per requirements
        and return a unique array of all matches found.
    */
    getAllMatches() {
        const myArray = [];
        for (let rowIndex = 0; rowIndex < this.gameArray.length; rowIndex++) {
            for (let c = 0; c < this.gameArray[rowIndex].length - 2; c++) {
                if (this.gameArray[rowIndex][c] === this.gameArray[rowIndex][c + 1] &&
                    this.gameArray[rowIndex][c] === this.gameArray[rowIndex][c + 2]) {
                    myArray.push([rowIndex, c]);
                    myArray.push([rowIndex, c + 1]);
                    myArray.push([rowIndex, c + 2]);
                }
            }
        }
        for (let colIndex = 0; colIndex < this.gameArray[0].length; colIndex++) {
            for (let r = 0; r < this.gameArray[0].length - 2; r++) {
                if (this.gameArray[r][colIndex] === this.gameArray[r + 1][colIndex]  &&
                    this.gameArray[r][colIndex] === this.gameArray[r + 2][colIndex]) {
                    myArray.push([r, colIndex]);
                    myArray.push([r + 1, colIndex]);
                    myArray.push([r + 2, colIndex]);
                }
            }
        }

        // Remove Duplicates from Array using Set
        let uniqueSet = new Set(myArray.map(JSON.stringify));
        let uniqueArray = Array.from(uniqueSet);
        console.log('-passed ' + uniqueArray)
        let finalUniqueArray = uniqueArray.map(JSON.parse);

        return finalUniqueArray;
    }

    matchBothNeighbors(address1, address2) {
        console.log(`address1 : ` + this.gameArray[address1[0]][address1[1]])
        console.log(`address2 : ` + this.gameArray[address2[0]][address2[1]])

        // Check for matches around the first address
        const match1 = this.matchNeighbor(address1);

        // Check for matches around the second address
        const match2 = this.matchNeighbor(address2);

        // Return true if either address has a match
        return match1 || match2;
    }

    matchNeighbor(address) {
        let col = address[0];
        let row = address[1];

        // Check to the right and left. "center match"
        if (col > 0 && col < this.gameArray.length - 1) {
            if (this.gameArray[col][row] === this.gameArray[col - 1][row] &&
                this.gameArray[col][row] === this.gameArray[col + 1][row]) {
                return true;
            }
        }

        // Check above and below. "center match"
        if (row > 0 && row < this.gameArray[0].length - 1) {
            if (this.gameArray[col][row] === this.gameArray[col][row - 1] &&
                this.gameArray[col][row] === this.gameArray[col][row + 1]) {
                return true;
            }
        }

        // Check to the right for matches of any length
        for (let c = col + 1; c < this.gameArray[0].length; c++) {
            if (this.gameArray[c][row] !== this.gameArray[col][row]) {
                break;
            }
            if (c - col >= 2) {
                return true;
            }
        }

        // Check to the left for matches of any length
        for (let c = col - 1; c >= 0; c--) {
            if (this.gameArray[c][row] !== this.gameArray[col][row]) {
                break;
            }
            if (col - c >= 2) {
                return true;
            }
        }

        // Check above for matches of any length
        for (let r = row - 1; r >= 0; r--) {
            if (this.gameArray[col][r] !== this.gameArray[col][row]) {
                break;
            }
            if (row - r >= 2) {
                return true;
            }
        }

        // Check below for matches of any length
        for (let r = row + 1; r < this.gameArray.length; r++) {
            if (this.gameArray[col][r] !== this.gameArray[col][row]) {
                break;
            }
            if (r - row >= 2) {
                return true;
            }
        }
        return false; // Return false if no pattern is found
    }


    createRandomFantasticBeingsArr() {
        const gArr = [];
        for (let i = 0; i < this.rowsCount; i++) {
            const copy = [...this.possibleCreatureArray];

            // Ensure each row has exactly colCnt elements
            // if we don't do this...we get empty cells on right side
            const row = [];
            for (let j = 0; j < this.colsCount; j++) {
                this.shuffleTheArray(copy); // shuffle all creatures in this copy
                row.push(copy[j % copy.length]);
                //row.push(this.shuffledCreatures[j % this.shuffledCreatures.length]);
            }
            gArr.push(row);
        }
        //return this.gameArray = gArr;
        return gArr;
    }

    shuffleTheArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}


window.myApp = new MyApp();
window.clearMap = function() {
    myApp.clearMap();
};
window.renderMap = function(rowsCount, colsCount) {
    myApp.renderMap(rowsCount, colsCount);
};
window.redrawMap = function(gameArray) {
    return myApp.redrawMap(gameArray);
};
// note-: stage 5
window.generateRandomBeingName = function() {
    return myApp.generateRandomBeingName();
};


window.clearMap();
window.renderMap(5, 5);

const gArr = myApp.createRandomFantasticBeingsArr();
window.redrawMap(gArr);
// Note-: If global "window" was not a requirement
// const myApp = new MyApp();
// myApp.clearMap();
// myApp.renderMap(5, 5);
// myApp.redrawMap();