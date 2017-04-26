const TableMode = require('./table-model');
const TableView = require('./table-view');

const model = new TableMode();
const tableView = new TableView(model);
tableView.init();
