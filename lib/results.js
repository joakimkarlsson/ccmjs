function createResult(capacity) {
  var _results = [];

  function addResult(result) {
    var i,
        len,
        added = false;

    if(_results.length == 0) {
      _results.push(result);
      return;
    }

    for(i=0, len = _results.length; i<len; i += 1) {
      if(result.ccm > _results[i].ccm) {
        _results.splice(i, 0, result);
        added = true;
        break;
      }
    }

    if(!added) {
      _results.push(result);
    }

    if(capacity && _results.length > capacity) {
      _results.splice(-1, 1);
    }
  }

  function addResults(file, results) {
    var i, len;

    for(i = 0, len = results.length; i < len; i += 1) {
      addResult({file: file, ccm: results[i].ccm, line: results[i].line, name: results[i].name});
    }
  }

  return {
    results: function() {
      return _results;
    },
    addResults: addResults
  };
}

module.exports = {
  createResult: createResult
};
