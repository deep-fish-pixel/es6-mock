const chokidar = require('chokidar');

module.exports = function (hotServer, dir) {
  if (hotServer && dir) {
    const watcher = chokidar.watch(dir, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });
    watcher
      .on('add', path => reload(hotServer))
      .on('change', path => reload(hotServer))
      .on('unlink', path => reload(hotServer))
  }
}

function reload(server) {
  if (server && server.sockWrite) {
    server.sockWrite(server.sockets, 'content-changed');
  }
}
