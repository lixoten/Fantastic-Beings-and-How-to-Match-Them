//Stage 4
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

    matchArray = []

    constructor() {
        this.rowsCount = 0;
        this.colsCount = 0;
        this.mapElement = document.getElementById('map');
        this.gameArray = [];
    }

    reset() {
        this.firstClick = true;
        this.secondClick = false;
        //this.home_x = false;
        //this.home_y = false;
        this.selectedAddress = 0;
        this.neighborAddress = 0;
        this.leftNeighbor = 0;
        this.rightNeighbor = 0;
        this.topNeighbor = 0;
        this.botNeighbor = 0;

        this.matchArray = []
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
                        if (this.isNeighbor(this.selectedAddress, r, c)) {
                            this.secondClick = !this.secondClick

                            console.log("before "+ this.gameArray[this.selectedAddress[0]][this.selectedAddress[1]]);
                            console.log("before "+ this.gameArray[this.neighborAddress[0]][this.neighborAddress[1]]);
                            // Swap Creatures
                            this.creatureSwap(this.selectedAddress, this.neighborAddress)
                            let possibleMove = this.matchBothNeighbors(this.selectedAddress, this.neighborAddress);
                            if (!possibleMove) {
                                this.creatureSwap(this.selectedAddress, this.neighborAddress)
                                //     //return;
                            } else {
                                this.matchArray = this.matchHorizonalAndVertical();
                            }
                            // console.log(possibleMove);
                            console.log("after "+ this.gameArray[this.selectedAddress[0]][this.selectedAddress[1]]);
                            console.log("after "+ this.gameArray[this.neighborAddress[0]][this.neighborAddress[1]]);


                            this.redrawMap(this.gameArray); // Populate the map with creatures.

                        }
                    }
                })

                trElement.appendChild(tdElement);
            }
            this.mapElement.appendChild(trElement);
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

                // note-: reset after swap
                cell.className = "cell";
                cell.innerHTML = "";

                if (arrayExistsInArray([r, c], this.matchArray)) {
                    cell.className = "cell";
                    cell.dataset.being = ""; // note-: Key line to pass Stage 4, Test #11
                    cell.style.backgroundColor = "pink";

                    // note-: Kept image in cell so cell won't collapse when all match
                    //        just visibility:hidden.
                    //        If we remove the image in this scenerio the row or column will collapse
                    const imgElement = document.createElement('img');
                    imgElement.src = `images/${this.gameArray[r][c]}.png`;
                    imgElement.style = "visibility:hidden"
                    cell.appendChild(imgElement);

                    continue
                    //console.log("The array exists within the array of arrays.");
                }
                // else {
                //console.log("The array does not exist within the array of arrays.");
                // }

                cell.dataset.being = this.gameArray[r][c];
                const imgElement = document.createElement('img');
                imgElement.src = `images/${this.gameArray[r][c]}.png`;
                imgElement.dataset.coords = `x${c}_y${r}`;
                cell.innerHTML = "";
                cell.appendChild(imgElement);
            }
        }
        this.reset();

        function arrayExistsInArray(arrayToCheck, arrayOfArrays) {
            return arrayOfArrays.some(subArray =>
                subArray.length === arrayToCheck.length &&
                subArray.every((value, index) => value === arrayToCheck[index])
            );
        }

    }

    clearMap() {
        this.mapElement.innerHTML = '';
    }

    creatureSwap(creature, neighbor) {
        const tempHold = this.gameArray[creature[0]][creature[1]];
        this.gameArray[creature[0]][creature[1]] = this.gameArray[neighbor[0]][neighbor[1]];
        this.gameArray[neighbor[0]][neighbor[1]] = tempHold;
    }

    isNeighbor(address, r, c) {
        //home_x = r;
        //home_y = c;

        //setNeighbors(r, c);

        [this.topNeighbor, this.rightNeighbor, this.botNeighbor, this.leftNeighbor] = this.getNeighbors(address);// getAddress(address);

        // The LAST click
        this.neighborAddress = [r, c];

        const neighbors = [this.topNeighbor, this.rightNeighbor, this.botNeighbor, this.leftNeighbor];
        //return neighbors.includes(secondAddress); .// Does not work for arrays...make a function for it
        return isArrayIncluded(this.neighborAddress, neighbors);

        // if (clickedAddress === leftNeighbor || clickedAddress === rightNeighbor || clickedAddress === topNeighbor || clickedAddress === botNeighbor){
        //     return true;
        // } else {
        //     return false;
        // }
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
    For every piece
        check if previous two pieces are same color
        if true, destroy those three pieces.
        for every piece after that, if current color == destroyed color, destroy it. If not, break out of the loop.
        If it's possible to have more than one set of three at once in a single row (e.g. 3 reds then 3 blues), you'll have to run the loop multiple times until it doesn't destroy anything.
    */
    matchHorizonalAndVertical() {
        //let matchArray = [];
        let rowIndex = 0;//creatureIndexes[0];
        //let colIndex = 0;//creatureIndexes[1];
        //let creatureType = this.gameArray[rowIndex][colIndex];
        const mySet = new Set();

        for (let rowIndex = 0; rowIndex < this.gameArray.length; rowIndex++) {
            for (let c = 0; c < this.gameArray[rowIndex].length - 2; c++) {
                if (this.gameArray[rowIndex][c] === this.gameArray[rowIndex][c + 1] &&
                    this.gameArray[rowIndex][c] === this.gameArray[rowIndex][c + 2]) {
                    //this.gameArray[rowIndex][c + 1] === this.gameArray[rowIndex][c + 2]) {
                    mySet.add([rowIndex, c]);
                    mySet.add([rowIndex, c + 1]);
                    mySet.add([rowIndex, c + 2]);
                }
            }
        }
        for (let colIndex = 0; colIndex < this.gameArray[0].length; colIndex++) {
            for (let r = 0; r < this.gameArray[0].length - 2; r++) {
                if (this.gameArray[r][colIndex] === this.gameArray[r + 1][colIndex]  &&
                    this.gameArray[r][colIndex] === this.gameArray[r + 2][colIndex]) {
                    mySet.add([r, colIndex]);
                    mySet.add([r + 1, colIndex]);
                    mySet.add([r + 2, colIndex]);
                }
            }
        }

        return Array.from(mySet);
        // const tempArray = Array.from(mySet);
        // return tempArray.map(JSON.parse);
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

window.clearMap();
window.renderMap(5, 5);

const gArr = myApp.createRandomFantasticBeingsArr();
window.redrawMap(gArr);
// Note-: If global "window" was not a requirement
// const myApp = new MyApp();
// myApp.clearMap();
// myApp.renderMap(5, 5);
// myApp.redrawMap();