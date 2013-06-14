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

      try {
      results.addResults(file,  calculator.calculate(content));
      }
      catch(err) {
        res.errors.push({ file: file, message: err.message, line: err.line, col: err.col, pos: err.pos });
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
