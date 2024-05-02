import path from 'path';
const pagePath = path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web';

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

class Test extends StageTest {

    page = this.getPage(pagePath)

    tests = [
        //Test#1 - check existence of map element
        this.page.execute(() => {
            this.map = document.getElementById('map');

            return this.map ?
                correct() :
                wrong(`You need to create a table with the ID "map"`)
        }),
        //Test#2 - check that map set class cell to the cells
        this.node.execute(async () => {
            const cells = await this.page.findAllBySelector('.cell');

            return cells.length === 25 ?
                correct() :
                wrong(`Each cell of the map must have a 'cell' class.`);
        }),
        //Test#3 - check render of beings function work
        this.node.execute(async () => {
            this.imgs = await this.page.findAllBySelector('img[data-coords]');
            this.cells = await this.page.findAllBySelector('.cell[data-being]');

            return this.imgs.length === 25 && this.cells.length === 25  ?
                correct() :
                wrong(`Beings rendering method must fill all empty cells of the map. Now you have ${this.cells.length} cells and ${this.imgs.length} beings.`);
        }),
        //Test#4 - check .cell[data-being] property
        this.page.execute(() => {
            let beings = ['zouwu', 'swooping', 'salamander', 'puffskein', 'kelpie'];
            let cellObjects = document.getElementsByClassName('cell');
            for(let c of cellObjects) {
                if(!beings.includes(c.dataset.being)) {
                    return wrong(`Each cell must have a dataset.being property, the value of which must be equal to the name of a random creature from a list of 5 possible creatures.
                    We see that the property of one of the cells is equal to the value: ${c.dataset.being}`);
                }
            }
            return correct();
        }),
        //Test#5 - check img[data-coords] property
        this.page.execute(() => {
            let imgObjs = document.querySelectorAll('img[data-coords]');
            return imgObjs[5].dataset.coords === 'x0_y1' ?
                correct() :
                wrong(`Img objects inside the table have an invalid dataset.coords property.`)
        }),
        //Test#6 - check background of selected being
        this.node.execute(async () => {
            const being = await this.page.findBySelector('img[data-coords=x0_y0]');
            await being.hover();

            const cell = await this.page.findBySelector('.cell');
            let style = await cell.getComputedStyles();

            return style.backgroundImage.includes('cell-hover-bg')  ?
                correct() :
                wrong(`The clicked cell must have a background image.`);
        }),
        //Test#7 - check click on non-neighboring cells
        this.node.execute(async () => {
            await this.page.refresh();
            sleep(500);
            const being1 = await this.page.findBySelector('img[data-coords=x0_y0]');
            await being1.click();
            const being2 = await this.page.findBySelector('img[data-coords=x2_y0]');
            await being2.click();

            this.cells = await this.page.findAllBySelector('.cell');
            let style1 = await this.cells[0].getComputedStyles();
            let style2 = await this.cells[2].getComputedStyles();
            await this.page.refresh();
            sleep(500);
            return style1.backgroundImage.includes('cell-selected-bg') &&
            style2.backgroundImage === 'none'  ?
                correct() :
                wrong(`When you click on one cell and the second click on another, non-adjacent cell, nothing should happen.`);
        }),
        //Test#8 - check clearMap function
        this.page.execute(() => {
            if (window.clearMap instanceof Function) {
                window.clearMap();
            } else {
                return wrong(`Implement the window.clearMap() function, please.`)
            }
            this.cells = document.getElementsByClassName('cell');
            return this.cells.length === 0 ?
                correct() :
                wrong(`Check your window.clearMap() function, now after it works, not all map cells are cleared.`)
        }),
        //Test#9 - check renderMap function
        this.page.execute(() => {
            if (window.renderMap instanceof Function) {
                window.renderMap(5, 5);
            } else {
                return wrong(`Implement the window.renderMap() function, please.`)
            }
            this.cells = document.getElementsByClassName('cell');
            return this.cells.length === 25 ?
                correct() :
                wrong(`Check your window.renderMap() function. When trying to draw a 5 by 5 map, it draws a map consisting of ${this.cells.length} cells.`)
        }),
        //Test#10 - check window.redrawMap
        this.page.execute(() => {
            window.clearMap();
            window.renderMap(3, 3);
            window.redrawMap([
                ['kelpie', 'puffskein', 'puffskein'],
                ['zouwu', 'zouwu', 'puffskein'],
                ['kelpie', 'puffskein', 'zouwu']
            ]);
            let cellObjects = document.getElementsByClassName('cell');

            window.generateRandomBeingName = function() {
                if (!window.generateNameFlag) window.generateNameFlag = 1;
                window.generateNameFlag++;
                let being = generateNameFlag % 2 === 0 ? 'puffskein' : 'zouwu';
                return being;
            }
            return cellObjects[5].dataset.being === 'puffskein' && cellObjects[8].dataset.being === 'zouwu' ?
                correct() :
                wrong(`Check the window.redrawMap method - at the moment it does not add creatures to the positions specified in the array.`)
        }),
        //Test#11 - check click on neighboring cells
        this.node.execute(async () => {

            const being1 = await this.page.findBySelector('img[data-coords=x1_y2]');
            await being1.click();
            const being2 = await this.page.findBySelector('img[data-coords=x2_y2]');
            await being2.click();
            sleep(1500);

            this.cells = await this.page.findAllBySelector('.cell[data-being]');
            const neededCells = ['kelpie', 'puffskein', 'puffskein', 'zouwu', 'puffskein', 'zouwu', 'kelpie', 'zouwu', 'puffskein'];
            for (let i = 0; i < this.cells.length; i++) {
                if (await this.cells[i].getAttribute('data-being') !== neededCells[i]) {
                    return wrong(`After clicking on adjacent elements, the resulting sequences of identical creatures should be removed.`);
                }
            }

            return correct();
        }),
    ]

}

it("Test stage", async () => {
        await new Test().runTests()
    }
).timeout(30000);
