(function() {
  var FakeSocket, events, util;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  util = require('util');

  events = require('events');

  FakeSocket = (function() {

    __extends(FakeSocket, events.EventEmitter);

    function FakeSocket() {
      this.writeBuffer = new Buffer('');
      this.writable = true;
    }

    FakeSocket.prototype.destroy = function() {};

    FakeSocket.prototype.destroySoon = function() {};

    FakeSocket.prototype.emitData = function(buffer) {
      if (this._events && this._events['data']) this.emit('data', buffer);
      if (this.ondata) return this.ondata(buffer, 0, buffer.length);
    };

    FakeSocket.prototype.setTimeout = function(timeout, callback) {};

    FakeSocket.prototype.write = function(data) {
      var combinedBuffer;
      data = new Buffer(data.toString());
      combinedBuffer = new Buffer(this.writeBuffer.length + data.length);
      this.writeBuffer.copy(combinedBuffer);
      combinedBuffer.write(data.toString(), this.writeBuffer.length);
      this.writeBuffer = combinedBuffer;
      return this.emit('write');
    };

    return FakeSocket;

  })();

  exports.FakeSocket = FakeSocket;

}).call(this);
