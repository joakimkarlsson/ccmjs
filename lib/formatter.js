function formatResult(results) {
  var i,
      len,
      res = results.results(),
      strings = [];

      
  function getCategorization(ccm) {
    if(ccm <= 10) {
      return 'simple, without much risk';
    }

    if(ccm <= 20) {
      return 'more complex, moderate risk';
    }

    if(ccm <= 50) {
      return 'complex, high risk';
    }

    return 'untestable, very high risk';
    
  }

  for(i = 0, len = res.length; i<len; i += 1) {
    strings.push(res[i].file + '(' + res[i].line + '): \'' + res[i].name + '\' ' + res[i].ccm + ' (' + getCategorization(res[i].ccm) + ')');
  }

  return strings;
}

module.exports = {
  formatResult: formatResult
};
