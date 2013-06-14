var calculator = require('./lib/calculator');
var results = require('./lib/results');
var formatter = require('./lib/formatter');


module.exports = {
  calculate: calculator.calculate,
  createResult: results.createResult,
  formatResult: formatter.formatResult
}
