(function() {
  var app, express, m2node;

  express = require('express');

  m2node = require('m2node');

  app = express.createServer();

  app.get('/', function(req, res) {
    return res.send('Hello World');
  });

  m2node.run(app, {
    send_spec: 'tcp://127.0.0.1:9996',
    recv_spec: 'tcp://127.0.0.1:9997'
  });

}).call(this);
