const { getLetterRange } = require('./array-util');
const { removeChildren, createTH, createTR, createTD } = require('./dom-util');
 
class TableView {
    constructor(model) {
        this.model = model;
    }
    // Initalizes refences, location, table, and events
    init() {
        this.initDomReferences();
        this.initCurrentCell();
        this.renderTable();
        this.attachEventHandlers();
    }

    //initalizes references for later use 
    initDomReferences() {
        this.headerRowEl = document.querySelector('THEAD TR');
        this.sheetBodyEl = document.querySelector('TBODY');
        this.formulaBarEl = document.querySelector('#formula-bar');
        this.sumBar = document.querySelector('#sum-bar');
        this.columnButton = document.querySelector('#addColumn');
        this.rowButton = document.querySelector('#addRow');
    }

    // defines location at program start
    initCurrentCell() {
        this.currentCellLocation = { col: 0, row: 0 };
        this.renderFormulaBar();
    }

    // prevents undefined from appearing in formula bar
    normalizeValueForRendering(value) {
        return value || '';
    }

    // Renders the formula bar from cell location and value
    renderFormulaBar() {
        const currentCellValue = this.model.getValue(this.currentCellLocation);
        this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
        this.formulaBarEl.focus();
    }
    //Calls to renders sections of the table
    renderTable() {
        this.renderTableHeader();
        this.renderTableBody();
        this.renderSumBar();
    }

    // Renders A, B, C, ... through ZZ for table header.
    renderTableHeader() {
        removeChildren(this.headerRowEl);
        this.headerRowEl.appendChild(createTH(' '))
        getLetterRange('A', this.model.numCols)
            .map(colLabel => createTH(colLabel))
            .forEach(th => this.headerRowEl.appendChild(th));
    }

    // Renders the sum of all the columns
    renderSumBar() {
        const sumData = new Array(this.model.numCols);
        for (let col = 0; col < this.model.numCols + 1; col++) {
            sumData[col] = 0;
            for (let row = 0; row < this.model.numRows; row++) {
                const position = { col: col - 1, row: row };
                const value = parseInt(this.model.getValue(position))
                if ((typeof value === 'number') && !isNaN(value)) {
                    sumData[col] = sumData[col] + value;
                }
            }
        }
        removeChildren(this.sumBar);
        sumData.map(colSum => createTD(colSum)).forEach(cs => this.sumBar.appendChild(cs));
    }

    // returns if the given location (in col, row) matches actual location  
    isCurrentCell(col, row) {
        return this.currentCellLocation.col === col &&
            this.currentCellLocation.row === row;
    }

    // returns if the given column location (in col) matches actual column location
    isCurrentCol(col) {
        return this.currentCellLocation.col === col &&
            this.model.highlight.col === true;
    }

    // returns if the given row location (in row) matches actual row location
    isCurrentRow(row) {
        return this.currentCellLocation.row === row &&
            this.model.highlight.row === true;
    }

    //renders table body, updates class of table cells created, and creates the first table row
    renderTableBody() {
        const fragment = document.createDocumentFragment();
        for (let row = 0; row < this.model.numRows; row++) {
            const th = createTH(row + 1);
            th.setAttribute('class', 'headerColumn');
            const tr = createTR();
            tr.appendChild(th);
            for (let col = 0; col < this.model.numCols; col++) {
                const position = { col: col, row: row }
                const value = this.model.getValue(position);
                const td = createTD(value);

                if (this.isCurrentCell(col, row)) {
                    td.className = 'current-cell';
                } else if (this.isCurrentCol(col + 1)) {
                    td.className = 'current-column';
                } else if (this.isCurrentRow(row)) {
                    td.className = 'current-row';
                }

                tr.appendChild(td)

            }
            fragment.appendChild(tr);
        }
        removeChildren(this.sheetBodyEl);
        this.sheetBodyEl.appendChild(fragment);
    }

    //Attaches event handlers to the specified DOM elements
    attachEventHandlers() {
        this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
        this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
        this.columnButton.addEventListener('click', this.addColumn.bind(this));
        this.rowButton.addEventListener('click', this.addRow.bind(this));
        this.headerRowEl.addEventListener('click', this.handleColumnClick.bind(this));
    }

    //Adds column when called. Called by click columnButton.
    addColumn() {
        this.model.numCols += 1;
        if(this.model.highlight.col === true) {
            const colLocation = this.currentCellLocation.col;
            for (let row = 0; row < this.model.numRows; row ++) {
               for (let col = this.model.numCols; col > 0 ; col--) {
                    if(col > colLocation) {
                        const previousColumnStoredValue = this.model.getValue({col: col - 1, row: row});
                        this.model.setValue({col: col, row: row}, previousColumnStoredValue);
                    }
                    if(col === colLocation) {
                        this.model.setValue({col: col, row: row}, 0);
                    }
               }
           }
        }
        this.renderTable();
    }

    //Adds row when called. Called by clicking rowButton.
    addRow() {
        this.model.numRows += 1;
        if(this.model.highlight.row === true) {
            const rowLocation = this.currentCellLocation.row;
            for (let col = 0; col < this.model.numCols; col++) {
               for (let row = this.model.numRows; row > 0 ; row--) {
                    if(row > rowLocation) {
                        const previousRowStoredValue = this.model.getValue({col: col, row: row - 1 });
                        this.model.setValue({col: col, row: row}, previousRowStoredValue);
                    }
                    if(row === rowLocation) {
                        this.model.setValue({col: col, row: row}, 0);
                    }
               }
           }
        }
        this.renderTable();
    }

    //Changes value when key is pressed and formulaBar is focused
    handleFormulaBarChange(evt) {
        const value = this.formulaBarEl.value;
        this.model.setValue(this.currentCellLocation, value);
        this.renderTableBody();
        this.renderSumBar();
    }

    // Changes highlight property of model to Col when a Column Header is clicked
    // Updates column location
    handleColumnClick(evt) {
        this.model.highlight = {
            col: true,
            cell: false,
            row: false
        };

        const col = evt.target.cellIndex;
        this.currentCellLocation = { col: col };
        this.renderTableBody();
    }

    // Changes highlight property of model to either cell or row based on location clicked
    // Updates location
    handleSheetClick(evt) {
        this.model.highlight = {
            col: false,
            cell: true,
            row: false
        };
        const col = evt.target.cellIndex - 1;
        const row = evt.target.parentElement.rowIndex - 1;
        if (col < 0) {
            this.model.highlight = {
                col: false,
                cell: false,
                row: true
            };
        }
        this.currentCellLocation = { col: col, row: row };
        this.renderTableBody();
        this.renderFormulaBar();
    }


}

module.exports = TableView;
