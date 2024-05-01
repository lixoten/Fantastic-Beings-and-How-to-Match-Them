import path from 'path';
const pagePath = path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web';

class Test extends StageTest {

    page = this.getPage(pagePath)

    tests = [
        // Test#1 - check existence of board element
        this.page.execute(() => {
            this.board = document.getElementById('board');

            return this.board ?
                correct() :
                wrong(`You need to create a game board with the ID "board"`)
        }),
        // Test#2 - check existence of table element
        this.page.execute(() => {
            let boardChilds = this.board.children;
            for(let i of boardChilds) {
                if(i.tagName === 'TABLE') {
                    return correct();
                }
            }

            return wrong(`You need to create a table element for map in your board`)
        }),
        // Test#3 - check existence of status-bar
        this.page.execute(() => {
            this.statusBar = document.getElementById('status-bar');

            return this.statusBar ?
                correct() :
                wrong(`You need to create a status bar with the ID "status-bar"`)
        }),
        // Test#4 - check height of board
        this.page.execute(() => {
            this.bodyStyles = window.getComputedStyle(document.body);
            this.boardStyles = window.getComputedStyle(this.board);

            return this.boardStyles.height === this.bodyStyles.height ?
                correct() :
                wrong(`Board element must occupy the entire height of the visible area of the screen`);
        }),
        // Test#5 - check existence of map element
        this.page.execute(() => {
            this.map = document.getElementById('map');

            return this.map ?
                correct() :
                wrong(`You need to create a table with the ID "map"`)
        }),
        // Test#6 - check number of rows in table
        this.page.execute(() => {
            let rows = this.map.rows.length;

            return rows === 5 ?
                correct() :
                wrong(`You need to create a map with 5 rows, found ${rows}`)
        }),
        // Test#7 - check width and height of map
        this.page.execute( () => {
            this.mapStyles = window.getComputedStyle(this.map);
            this.boardHeight = parseFloat(this.boardStyles.height.replace('px', ''));
            this.mapHeight = parseFloat(this.mapStyles.height.replace('px', ''));
            let mapHeightPercents = Math.round(this.mapHeight / (this.boardHeight / 100));

            return mapHeightPercents === 60 ?
                correct() :
                wrong(`The height of the map should be 60% of the height of the visible area of the screen.` +
                    `Now the height of the map is ${mapHeightPercents} percent of the height of the playing field`);
        }),
        // Test#8 - check form of map
        this.page.execute( () => {
            this.mapWidth = parseFloat(this.mapStyles.width.replace('px', ''));

            return Math.abs(this.mapWidth - this.mapHeight) < 1 ?
                correct() :
                wrong(`The map must be square. Now width=${this.mapWidth}px and height=${this.mapHeight}px`);
        }),
        // Test#9 - check horizontal position of map
        this.page.execute(() => {
            let boardWidth = parseFloat(this.boardStyles.width.replace('px', ''));
            let mapWidth = this.mapStyles.width.replace('px', '');
            let mapMarginLeft = this.mapStyles.marginLeft.replace('px', '');

            return Math.abs(boardWidth - mapWidth - 2*mapMarginLeft) < 1 ?
                correct() :
                wrong(`You need to position the game map in the center relative to the horizontal`)
        }),
        // Test#10 - check height of status-bar #test
        this.page.execute(() => {
            this.statusBarStyles = window.getComputedStyle(this.statusBar);
            this.statusBarHeight = this.statusBarStyles.height.replace('px', '');

            return Math.abs(this.boardHeight * 0.1 - this.statusBarHeight < 1) ?
                correct() :
                wrong(`The height of the status bar should be 10 percent of the height of the visible area of ​​the screen`);
        }),
        // Test#11 - check vertical position of map
        this.page.execute(() => {
            let mapMarginTop = this.boardHeight*0.03;

            return Math.abs(mapMarginTop - this.mapStyles.marginTop.replace('px', '')) < 1 ?
                correct() :
                wrong(`The map should have a vertical offset from the status bar in the frame of 3 percent of the height of the visible area of ​​the screen`);
        }),
        // Test#12 - check number of cells in map
        this.page.execute(() => {
            let tds = document.getElementsByTagName('td').length;
            let cells = document.getElementsByClassName('cell').length;

            return cells === 25 && tds === 25 ?
                correct() :
                wrong(`You need to create a map with 25 cells, found ${cells} cells and ${tds} 'td' elements`)
        }),
        // Test#13 - check borders of cells
        this.page.execute(() => {
            this.cells = document.getElementsByClassName('cell');
            let i = 0;
            for (let elem of this.cells) {
                i++;
                let currBorder = window.getComputedStyle(elem).border;
                if (currBorder.includes('0px') || !currBorder.includes('rgb(103, 101, 168)')) {
                    return wrong(`Looks like cell of game map #${i} ` +
                        `has no border. It should have a mediumpurple border.`);
                }
            }
            return correct()
        }),
        // Test#14 - check background images
        this.page.execute(() => {
            let boardImg = this.boardStyles.backgroundImage;
            let statusBarImg = this.statusBarStyles.backgroundImage;

            return boardImg && statusBarImg ?
                correct():
                wrong(`Board and status bar must have background images.`)
        }),
        // Test#15 - check background-color of cell
        this.page.execute(() => {
            let cellBackground = window.getComputedStyle(this.cells[0]).background;

            return cellBackground.includes('rgba(103, 101, 168, 0.4)') ?
                correct() :
                wrong(`Cells must have rgb(103, 101, 168) color with 40% of transparency`);
        }),
        // Test#16 - check width of status bar
        this.page.execute(() => {
            let statusBarWidth = parseFloat(this.statusBarStyles.width.replace('px', ''));

            return statusBarWidth == this.boardStyles.width.replace('px', '') ?
                correct() :
                wrong();
        }),
    ]

}

it("Test stage", async () => {
        await new Test().runTests()
    }
).timeout(30000);
