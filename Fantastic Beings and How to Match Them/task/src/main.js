//Stage 2
class MyApp {
    constructor() {
        this.rowsCount = 0;
        this.colsCount = 0;
        this.mapElement = document.getElementById('map');
    }

    renderMap(rowsCount, colsCount) {
        this.rowsCount = rowsCount;
        this.colsCount = colsCount;

        for (let r = 0; r < this.rowsCount; r++) {
            const trElement = document.createElement('tr');
            for (let c = 0; c < this.colsCount; c++) {
                const tdElement = document.createElement('td');
                tdElement.setAttribute('class', 'cell');
                tdElement.textContent = `${r} - ${c}`;
                trElement.appendChild(tdElement);
            }
            this.mapElement.appendChild(trElement);
        }
    }

    clearMap() {
        this.mapElement.innerHTML = '';
    }
}

window.myApp = new MyApp();
window.clearMap = function() {
    myApp.clearMap();
};
window.renderMap = function(rowsCount, colsCount) {
    myApp.renderMap(rowsCount, colsCount);
};
window.clearMap();
window.renderMap(5, 5);

// Note-: If global "window" was not a requirement
// const myApp = new MyApp();
// myApp.clearMap();
// myApp.renderMap(5, 5);