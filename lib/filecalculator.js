function create(fs, calculator, results, filter) {

  function calculateFor(files) {
    var res = {
          errors: []
        };

    files.forEach(function(file) {
      if(filter && !filter(file)) {
        return;
      }

      var content = fs.readFileSync(file, { encoding: 'utf8' } );
      var calculationResult = calculator.calculate(content, function(err) {
        res.errors.push({ file: file, message: err.message, line: err.line, col: err.col });
      });

      if(calculationResult) {
        results.addResults(file, calculationResult);
      }
    });

    res.results = results.results();

    return res;
  }

  return {
    calculateFor: calculateFor
  };
}

module.exports = {
  create: create
};
