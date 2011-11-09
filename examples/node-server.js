(function() {
  var http, m2node, server;

  http = require('http');

  m2node = require('m2node');

  server = http.createServer(function(req, res) {
    console.log("" + req.method + " " + req.url);
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    return res.end('Hello World\n');
  });

  m2node.run(server, {
    send_spec: 'tcp://127.0.0.1:9996',
    recv_spec: 'tcp://127.0.0.1:9997'
  });

}).call(this);
