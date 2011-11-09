m2node
======

m2node is a mongrel2 handler for node.

Install
-------

    npm install m2node

If you are having issues building the zmq module because of a missing `ev.h` file, then review the following.

**Note: These instructions are valid on Mac as of node v0.6.0 and 0MQ v2.1.10.**

Node v0.6.0 moved the ev.h file to `/usr/local/include/node/uv-private/ev.h`.  

To fix this install `libev` separately:

    # Install Node v0.6.0 from source (brew is currently at Node v4.12)
    git clone https://github.com/joyent/node.git
    git checkout v0.6.0
    cd node && ./configure && make && make install
    
    # Install libev separately
    brew install libev
    
    # Install 0MQ v2.1.10
    brew install zeromq
    
    # Install the zmq module
    npm install -d

Example
-------

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

Configuration
-------------

The configuration is from the perspective of the handler, so the `send_spec` in your mongrel2 config should match the `recv_spec` in your node config.

Example - express
-----------------

Here's an example of serving an app built using the [express framework](http://expressjs.com/) with m2node

    var express = require('express'),
    m2node = require('m2node');

    var app = express.createServer();

    app.get('/', function (req, res) {
        res.send('Hello World')
    });

    m2node.run(app, {
        send_spec: 'tcp://127.0.0.1:9996'
        recv_spec: 'tcp://127.0.0.1:9997'
    });

Example - JSON
-----------------

Here's an example of handling a JSON message from mongrel2.

    var express = require('express'),
    m2node = require('m2node');

    var app = express.createServer();

    app.get('/', function (req, res) {
        res.send('Hello World')
    });

    json_handler = function(req, res) {
        return res.end({
            message: "hi"
        });
    };
    m2node.run(app, {
        json_handler: 
            send_spec: 'tcp://127.0.0.1:9996'
            recv_spec: 'tcp://127.0.0.1:9997'
    });

Contributors
------------

See package.json

