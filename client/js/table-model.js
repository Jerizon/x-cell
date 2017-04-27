class TableModel {
    constructor(numCols = 10, numRows = 20) {
        this.numCols = numCols;
        this.numRows = numRows;
        this.data = {};
        this.highlight = {
            cell: true,
            col: false,
            row: false
        }
    }

    _getCellId(location) {
        return `${location.col}:${location.row}`;
    }
    getValue(location) {
        return this.data[this._getCellId(location)];
    }

    setValue(location, value) {
        this.data[this._getCellId(location)] = value;
    }
}

module.exports = TableModel;
