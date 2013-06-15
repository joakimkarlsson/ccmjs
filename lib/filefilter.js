var minimatch = require('minimatch');

function create(patterns) {

  return function(path) {
    if(!patterns) {
      return false;
    }

    for(i = 0, len = patterns.length; i < len; i += 1) {
      if(minimatch(path, patterns[i])) {
        return true;
      }
    };
    return false;
  };
}

module.exports = {
  create: create
};
