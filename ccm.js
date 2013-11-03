var calculator = require('./lib/calculator');
var results = require('./lib/results');
var formatter = require('./lib/formatter');
var fileCalculator = require('../lib/filecalculator');
var fileFilter = require('../lib/fileFilter');
var fs = require('fs');
var util = require('util');
var glob = require('glob');
var minimatch = require('minimatch');

function run(options) {
  var filter = fileFilter.create(options.exclude);

  var topResult = results.createResult(parseInt(options.results));

  var ccmCalculator = {
    calculate: calculator.calculate,
  }

  var calculator = fileCalculator.create(fs, ccmCalculator, topResult, function(file) {
    return !filter(file);
  });

  glob(options.files, function(err, files) {
    var res = calculator.calculateFor(files);
    formatter.formatResult(res.results).forEach(function(res) {
      console.log(res);
    });

    if(res.errors && res.errors.length > 0) {
      console.log('\nFailed to parse the following files:');
      res.errors.forEach(function(err) {
        console.log(err.file + ' (' + err.line + ',' + err.col + '): ' + err.message);
      });
    }
  });
}

module.exports = {
  run: run
};

