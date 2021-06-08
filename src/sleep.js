const deasync = require('deasync');

module.exports = function(time) {
  deasync.sleep(time);
};
