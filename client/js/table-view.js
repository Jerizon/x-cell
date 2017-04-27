const { getLetterRange } = require('./array-util');
const { removeChildren, createTH, createTR, createTD } = require('./dom-util');

class TableView {
    constructor(model) {
        this.model = model;
    }

    init() {
        this.initDomReferences();
        this.initCurrentCell();
        this.renderTable();
        this.attachEventHandlers();
    }

    initDomReferences() {
        this.headerRowEl = document.querySelector('THEAD TR');
        this.sheetBodyEl = document.querySelector('TBODY');
        this.formulaBarEl = document.querySelector('#formula-bar');
        this.sumBar = document.querySelector('#sum-bar');
        this.columnButton = document.querySelector('#addColumn');
        this.rowButton = document.querySelector('#addRow');
    }

    initCurrentCell() {
        this.currentCellLocation = { col: 0, row: 0 };
        this.renderFormulaBar();
    }

    normalizeValueForRendering(value) {
        return value || '';
    }

    renderFormulaBar() {
        const currentCellValue = this.model.getValue(this.currentCellLocation);
        this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
        this.formulaBarEl.focus();
    }
    renderTable() {
        this.renderTableHeader();
        this.renderTableBody();
        this.renderSumBar();
    }
    renderTableHeader() {
        removeChildren(this.headerRowEl);
        getLetterRange('A', this.model.numCols)
            .map(colLabel => createTH(colLabel))
            .forEach(th => this.headerRowEl.appendChild(th));
    }

    renderSumBar() {
        const sumData = new Array(this.model.numCols);
        for (let col = 0; col < this.model.numCols; col++) {
            sumData[col] = 0;
            for (let row = 0; row < this.model.numRows; row++) {
                const position = { col: col, row: row };
                const value = parseInt(this.model.getValue(position))
                if ((typeof value === 'number') && !isNaN(value)) {
                    sumData[col] = sumData[col] + value;
                }
            }
        }
        removeChildren(this.sumBar);
        sumData.map(colSum => createTD(colSum)).forEach(cs => this.sumBar.appendChild(cs));
    }

    isCurrentCell(col, row) {
        return this.currentCellLocation.col === col &&
            this.currentCellLocation.row === row;
    }

    isCurrentCol(col) {
        return this.currentCellLocation.col === col &&
            this.model.highlight.col === true;
    }

    renderTableBody() {
        const fragment = document.createDocumentFragment();
        for (let row = 0; row < this.model.numRows; row++) {
            const tr = createTR();
            for (let col = 0; col < this.model.numCols; col++) {
                const position = { col: col, row: row }
                const value = this.model.getValue(position);
                const td = createTD(value);

                if (this.isCurrentCell(col, row)) {
                    td.className = 'current-cell';
                } else if (this.isCurrentCol(col)) {
                    td.className = 'current-column';
                }

                tr.appendChild(td);
            }
            fragment.appendChild(tr);
        }
        removeChildren(this.sheetBodyEl);
        this.sheetBodyEl.appendChild(fragment);
    }

    attachEventHandlers() {
        this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
        this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
        this.columnButton.addEventListener('click', this.addColumn.bind(this));
        this.rowButton.addEventListener('click', this.addRow.bind(this));
        this.headerRowEl.addEventListener('click', this.handleColumnClick.bind(this));
    }
    addColumn() {
        this.model.numCols += 1;
        this.renderTable();
    }
    addRow() {
        this.model.numRows += 1;
        this.renderTable();
    }

    handleFormulaBarChange(evt) {
        const value = this.formulaBarEl.value;
        this.model.setValue(this.currentCellLocation, value);
        this.renderTableBody();
        this.renderSumBar();
    }

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

    handleSheetClick(evt) {
        this.model.highlight = {
            col: false,
            cell: true,
            row: false
        };
        const col = evt.target.cellIndex;
        const row = evt.target.parentElement.rowIndex - 1;

        this.currentCellLocation = { col: col, row: row };
        this.renderTableBody();
        this.renderFormulaBar();
    }


}

module.exports = TableView;
