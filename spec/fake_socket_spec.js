var vows = require('vows');
var assert = require('assert');
var sys = require('sys');
var FakeSocket = require('../lib/m2node/fake_socket').FakeSocket;

vows.describe('fake socket').addBatch({
  'write': {
    'it accepts a string': function (socket) {
      var socket = new FakeSocket();
      socket.write('string written to socket');
      assert.equal(socket.writeBuffer.toString(), 'string written to socket');
    },

    'it calls toString on data if not a buffer or string': function (socket) {
      var socket = new FakeSocket();
      socket.write({
        toString: function () { return 'string returned from toString()'; }
      });
      assert.equal(socket.writeBuffer.toString(), 'string returned from toString()');
    }
  }
}).export(module);

