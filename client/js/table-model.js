class TableModel {
    // Creates default structure and properties for table model
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
    // Returns cell's ID  based on location
    _getCellId(location) {
        return `${location.col}:${location.row}`;
    }
    // Returns cell's value based on location
    getValue(location) {
        return this.data[this._getCellId(location)];
    }

    // Sets cell's value based on location and given value
    setValue(location, value) {
        this.data[this._getCellId(location)] = value;
    }
}

module.exports = TableModel;
