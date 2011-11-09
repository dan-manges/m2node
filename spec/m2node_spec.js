var vows = require('vows');
var assert = require('assert');
var http = require('http');
var m2node = require('../lib/m2node');

vows.describe('m2node').addBatch({
  'smoke test': {
    topic: function () {
      var callback = this.callback;
      var req = http.request({
        host: 'localhost',
        port: 9000,
        method: 'GET',
        path: '/'
      }, function (response) {
        response.on('data', function (chunk) {
          callback(null, {
            status: response.statusCode,
            headers: response.headers,
            body: chunk
          })
        });
      });
      req.end();
    },

    'is successful': function (err, response) {
      assert.equal(response.status, '200');
      assert.equal(response.body.toString(), 'Hello World\n');
    }
  },

  'request headers': {
    topic: function () {
      var callback = this.callback;
      var req = http.request({
        host: 'localhost',
        port: 9000,
        method: 'GET',
        path: '/echo_headers',
        headers: {'X-Testing': 'm2node'}
      }, function (response) {
        response.on('data', function (chunk) {
          callback(null, {
            status: response.statusCode,
            headers: response.headers,
            body: chunk
          })
        });
      });
      req.end();
    },

    'are all passed to the server': function (err, response) {
      assert.equal(response.status, '200');
      assert.equal(JSON.parse(response.body.toString())['x-testing'], 'm2node');
    },

    'do not include the non-http headers': function (err, response) {
      assert.equal(response.status, '200');
      var responseBody = JSON.parse(response.body.toString());
      var keys = [];
      for (var key in responseBody) { keys.push(key); }
      assert.equal(keys.length, 4);
      assert.include(keys, 'connection');
      assert.include(keys, 'host');
      assert.include(keys, 'x-forwarded-for');
      assert.include(keys, 'x-testing');
    }
  },

  'response headers': {
    topic: function () {
      var callback = this.callback;
      var req = http.request({
        host: 'localhost',
        port: 9000,
        method: 'GET',
        path: '/set_response_header'
      }, function (response) {
        response.on('data', function (chunk) {
          callback(null, {
            status: response.statusCode,
            headers: response.headers,
            body: chunk
          })
        });
      });
      req.end();
    },

    'are all passed back': function (err, response) {
      assert.equal(response.status, '200');
      assert.equal(response.headers['x-customresponseheader'], 'm2node');
    }
  },

  'request body': {
    topic: function () {
      var callback = this.callback;
      var postData = 'foo=bar&body_echoed=true';
      var req = http.request({
        host: 'localhost',
        port: 9000,
        method: 'POST',
        path: '/echo_body',
        headers: {'Content-Length': postData.length}
      }, function (response) {
        response.on('data', function (chunk) {
          callback(null, {
            status: response.statusCode,
            headers: response.headers,
            body: chunk
          })
        });
      });
      req.write(postData);
      req.end();
    },

    'are all passed back': function (err, response) {
      assert.equal(response.status, '200');
      assert.equal(response.body.toString(), 'foo=bar&body_echoed=true');
    }
  },

  'request url': {
    topic: function () {
      var callback = this.callback;
      var req = http.request({
        host: 'localhost',
        port: 9000,
        method: 'GET',
        path: '/echo_request_url?a=b&c=d'
      }, function (response) {
        response.on('data', function (chunk) {
          callback(null, {
            status: response.statusCode,
            headers: response.headers,
            body: chunk
          })
        });
      });
      req.end();
    },

    'it contains the query string': function (err, response) {
      assert.equal(response.status, '200');
      assert.equal(response.body.toString(), '/echo_request_url?a=b&c=d');
    }
  },

  'return value from m2node.run': {
    topic: function () {
      server = http.createServer(function (req, res) {
      });
      handler = m2node.run(server, {
        send_spec: 'tcp://127.0.0.1:9991',
        recv_spec: 'tcp://127.0.0.1:9992'
      });
      this.callback(null, handler);
    },
    'returns the handler with access to sockets': function (err, handler) {
      assert.isObject(handler.pullSocket);
      assert.isObject(handler.pubSocket);
      handler.pullSocket.close();
      handler.pubSocket.close();
    }
  }
}).export(module)

