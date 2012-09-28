m2node
======

m2node is a mongrel2 handler for node

install
-------

  npm install m2node

example
-------

```javascript
var http = require('http'),
    m2node = require('m2node');

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});

m2node.run(server, {
  send_spec: 'tcp://127.0.0.1:9996',
  recv_spec: 'tcp://127.0.0.1:9997'
});
```

configuration
-------------

The configuration is from the perspective of the handler, so the send_spec in your mongrel2 config should match the recv_spec in your node config.

example - express
-----------------

here's an example of serving an app built using the [express framework](http://expressjs.com/) with m2node

```javascript
var express = require('express'),
    http = require('http'),
    m2node = require('m2node');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World')
});

m2node.run(
  http.createServer(app), {
    send_spec: 'tcp://127.0.0.1:9996'
    recv_spec: 'tcp://127.0.0.1:9997'
});
```

contributors
------------

see package.json

