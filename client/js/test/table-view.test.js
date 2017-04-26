const fs = require('fs');
const TableModel = require('../table-model');
const TableView = require('../table-view');

describe('table-view', () => {
	beforeEach(() => {
		//load HTML skeleton from disk and parse into DOM
		const fixturePath = './client/js/test/fixtures/sheet-container.html';
		const html = fs.readFileSync(fixturePath, 'utf8');
		document.documentElement.innerHTML = html;
	})
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
			expect(ths.length).toBe(numCols);
			
			let labelTexts = Array.from(ths).map(el => el.textContent);
			expect(labelTexts).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
		});
	});
}); 