//Stage 3
class MyApp {
    possibleCreatureArray = [`zouwu`, `swooping`, `salamander`, `puffskein`, `kelpie`];

    constructor() {
        this.rowsCount = 0;
        this.colsCount = 0;
        this.mapElement = document.getElementById('map');
        this.gameArray = [];
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

                cell.dataset.being = this.gameArray[r][c];
                const imgElement = document.createElement('img');
                imgElement.src = `images/${this.gameArray[r][c]}.png`;
                imgElement.dataset.coords = `x${c}_y${r}`;
                cell.innerHTML = "";
                cell.appendChild(imgElement);
            }
        }
    }


    clearMap() {
        this.mapElement.innerHTML = '';
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
            }
            gArr.push(row);
        }
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