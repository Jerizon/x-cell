const fs = require('fs');
const TableModel = require('../table-model');
const TableView = require('../table-view');

describe('table-view', () => {
    beforeEach(() => {
        //load HTML skeleton from disk and parse into DOM
        const fixturePath = './client/js/test/fixtures/sheet-container.html';
        const html = fs.readFileSync(fixturePath, 'utf8');
        document.documentElement.innerHTML = html;
    });

    describe('highlighting entire columns and rows', () => {
        it('highlights an entire column when column header is clicked', () => {

            // set up the intial state
            const model = new TableModel(10, 5);
            const view = new TableView(model);
            view.init();

            // inspect the inital state
            let trs = document.querySelectorAll('TBODY TR');
            let td = trs[2].cells[3];
            expect(td.className).toBe('');

            // simultate user action
            let ths = document.querySelectorAll('THEAD TH');
            let th = ths[3];
            th.click();

            //inspect the resulting state
            trs = document.querySelectorAll('TBODY TR');
            td = trs[2].cells[3];
            expect(td.className).not.toBe('');
        })

        it('highlights an entire row when row header is clicked', () => {

            // set up the intial state
            const model = new TableModel(10, 5);
            const view = new TableView(model);
            view.init();

            // inspect the inital state
            let trs = document.querySelectorAll('TBODY TR');
            let td = trs[2].cells[3];
            expect(td.className).toBe('');

            // simultate user action
            let ths = document.querySelectorAll('TBODY TR');
            let th = ths[2].cells[0];
            th.click();

            //inspect the resulting state
            trs = document.querySelectorAll('TBODY TR');
            td = trs[2].cells[3];
            expect(td.className).not.toBe('');
        })

    });

    describe('sum column row', () => {
        it('sums columns and displays culmulative totals', () => {
            //set up the inital state
            const model = new TableModel(3, 3);
            const view = new TableView(model)
            model.setValue({ col: 2, row: 1 }, '1');
            model.setValue({ col: 2, row: 2 }, '2');
            view.init();

            //inspect the inital state
            let trs = document.querySelectorAll('TBODY TR');
            let td = trs[1].cells[3];
            let td2 = trs[2].cells[3];

            expect(td.textContent).toBe('1');
            expect(td2.textContent).toBe('2');

            //simulate user action
            view.renderSumBar();

            //inspect the resulting state
            let tsc = document.querySelectorAll('#sum-bar > TD');
            expect(tsc[3].textContent).toBe('3');
        });
    });

    describe('formula bar', () => {
        it('makes changes TO the value of the current cell', () => {
            //set up the inital state
            const model = new TableModel(3, 3);
            const view = new TableView(model);
            view.init();

            //inspect the inital state
            let trs = document.querySelectorAll('TBODY TR');
            let td = trs[0].cells[1];
            expect(td.textContent).toBe('');

            //simulate user action
            document.querySelector('#formula-bar').value = '65';
            view.handleFormulaBarChange();

            //inspect the resulting state
            trs = document.querySelectorAll('TBODY TR');
            expect(trs[0].cells[1].textContent).toBe('65');
        });

        it('updates FROM the value of the current cell', () => {
            //set up the inital state
            const model = new TableModel(3, 3);
            const view = new TableView(model);
            model.setValue({ col: 2, row: 1 }, '123');
            view.init();

            //inspect the inital state
            const formulaBarEl = document.querySelector('#formula-bar');
            expect(formulaBarEl.value).toBe('');

            //simulate user action
            const trs = document.querySelectorAll('TBODY TR');
            trs[1].cells[3].click();

            //inspect the resulting state
            expect(formulaBarEl.value).toBe('123');
        });
    });

    describe('add column', () => {
        it('adds a column when addColumn button is clicked', () => {
            // set up inital state
            const numCols = 6;
            const numRows = 10;
            const model = new TableModel(numCols, numRows);
            const view = new TableView(model);
            view.init();

            // inspect the inital state
            let ths = document.querySelectorAll('THEAD TH');
            expect(ths.length).toBe(numCols + 1);
            

            // simulted user action
            view.columnButton.click();
           
            // inspect the resulting state
            ths = document.querySelectorAll('THEAD TH');
            expect(ths.length).toBe(numCols + 2);
        });

        it('shifts values over to the right by one when column header is clicked and adds a column', () => {
           
            // set up inital state
            const numCols = 6;
            const numRows = 10;
            const model = new TableModel(numCols, numRows);
            const view = new TableView(model);
            model.setValue({ col: 2, row: 1 }, '123');
            view.init();
         
            // inspect the inital state
            let trs = document.querySelectorAll('TBODY TR');
            let ths = document.querySelectorAll('THEAD TH');
            expect(ths.length).toBe(numCols + 1);
            expect(trs[1].cells[3].textContent).toBe('123');
        
            // simulted user action
            ths = document.querySelectorAll('THEAD TH');
            let th = ths[2];
            th.click();
            view.columnButton.click();
         
            // inspect the resulting state
            ths = document.querySelectorAll('THEAD TH');
            trs = document.querySelectorAll('TBODY TR');
            expect(ths.length).toBe(numCols + 2);
            expect(trs[1].cells[4].textContent).toBe('123');


        });
    });
    describe('add a row', () => {
        it('adds a row when addRow button is clicked', () => {
            // set up inital state
            const numCols = 6;
            const numRows = 10;
            const model = new TableModel(numCols, numRows);
            const view = new TableView(model);
            view.init();

            // inspect the inital state
            expect(model.numRows).toBe(numRows);

            // simulted user action
            view.rowButton.click();

            // inspect the resulting state
            expect(model.numRows).toBe(numRows + 1);
        });

        it('shifts values down by one when row header is clicked and adds a row', () => {
           
             // set up inital state
            const numCols = 6;
            const numRows = 10;
            const model = new TableModel(numCols, numRows);
            const view = new TableView(model);
            model.setValue({ col: 2, row: 2 }, '123');
            view.init();

            // inspect the inital state
            let trs = document.querySelectorAll('TBODY TR');
            expect(trs[2].cells[3].textContent).toBe('123');

            // simulted user action
            let ths = document.querySelectorAll('TBODY TR');
            let th = ths[2].cells[0];
            th.click();
            view.rowButton.click();

            // inspect the resulting state
            trs = document.querySelectorAll('TBODY TR');
            expect(model.numRows).toBe(numRows + 1);
            expect(trs[3].cells[3].textContent).toBe('123');
        });
    });
    describe('table body', () => {

        it('highlights the current cell when clicked', () => {
            // set up the intial state
            const model = new TableModel(10, 5);
            const view = new TableView(model);
            view.init();

            // inspect the inital state
            let trs = document.querySelectorAll('TBODY TR');
            let td = trs[2].cells[3];
            expect(td.className).toBe('');

            //simulate user action
            td.click();

            //inpsect the resulting state
            trs = document.querySelectorAll('TBODY TR');
            td = trs[2].cells[3];
            expect(td.className).not.toBe('');
        })
        it('has the predetermined size', () => {
            // set up the inital state
            const numCols = 6;
            const numRows = 10;
            const model = new TableModel(numCols, numRows);
            const view = new TableView(model);
            view.init();

            // inspect the inital state
            let ths = document.querySelectorAll('THEAD TH');
            expect(ths.length).toBe(numCols + 1);
        });
        it('fills in values from the model', () => {
            //set up the inital state
            const model = new TableModel(3, 3);
            const view = new TableView(model);
            model.setValue({ col: 2, row: 1 }, '123');
            view.init();
            //inspect the inital state
            const trs = document.querySelectorAll('TBODY TR');
            expect(trs[1].cells[3].textContent).toBe('123');
        });
    });

    describe('table header', () => {
        it('has valid column header lables', () => {
            //set up the initial state 
            const numCols = 6;
            const numRows = 10;
            const model = new TableModel(numCols, numRows);
            const view = new TableView(model);
            view.init();

            //inspect the inital state
            let ths = document.querySelectorAll('THEAD TH');
            expect(ths.length).toBe(numCols + 1);

            let labelTexts = Array.from(ths).map(el => el.textContent);
            expect(labelTexts).toEqual([' ', 'A', 'B', 'C', 'D', 'E', 'F']);
        });
    });
});
