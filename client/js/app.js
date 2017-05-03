const TableModel = require('./table-model');
const TableView = require('./table-view');

//initalize the current model
const model = new TableModel();
const tableView = new TableView(model);
tableView.init();
  