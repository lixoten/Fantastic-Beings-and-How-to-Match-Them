import path from 'path';
const pagePath = path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web';

class Test extends StageTest {

    page = this.getPage(pagePath)

    tests = [
        // Test#1 - check existence of map element
        this.page.execute(() => {
            this.map = document.getElementById('map');

            return this.map ?
                correct() :
                wrong(`You need to create a table with the ID "map"`)
        }),
        //Test#2 - check count of tds
        this.node.execute(async () => {
            const tds = await this.page.findAllBySelector('td');

            return tds.length === 25 ?
                correct() :
                wrong(`The map must be 5x5.`);
        }),
        //Test#3 - check that map set class cell to the cells
        this.node.execute(async () => {
            const cells = await this.page.findAllBySelector('.cell');

            return cells.length === 25 ?
                correct() :
                wrong(`Each cell of the map must have a 'cell' class.`);
        }),
        //Test#4 - check rows count
        this.node.execute(async () => {
            const cells = await this.page.findAllBySelector('tr');

            return cells.length === 5 ?
                correct() :
                wrong(`The map must have 5 rows in the table.`);
        }),
        //Test#5 - check clearMap function
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
        //Test#6 - check renderMap function
        this.page.execute(() => {
            if (window.renderMap instanceof Function) {
                window.renderMap(3, 3);
            } else {
                return wrong(`Implement the window.renderMap() function, please.`)
            }
            this.cells = document.getElementsByClassName('cell');
            return this.cells.length === 9 ?
                correct() :
                wrong(`Check your window.renderMap() function. When trying to draw a 3 by 3 map, it draws a map consisting of ${this.cells.length} cells.`)
        }),
    ]

}

it("Test stage", async () => {
        await new Test().runTests()
    }
).timeout(30000);
