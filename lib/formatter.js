function formatResult(results) {
  var i,
      len,
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

  for(i = 0, len = results.length; i<len; i += 1) {
    strings.push(results[i].file + '(' + results[i].line + '): \'' + results[i].name + '\' ' + results[i].ccm + ' (' + getCategorization(results[i].ccm) + ')');
  }

  return strings;
}

module.exports = {
  formatResult: formatResult
};
