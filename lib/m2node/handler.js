(function() {
  var Handler, MongrelRequest, events, zeromq;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  events = require('events');
  zeromq = require('zeromq');
  MongrelRequest = require('./mongrel_request').MongrelRequest;
  Handler = (function() {
    __extends(Handler, events.EventEmitter);
    function Handler(options) {
      this.pullSocket = zeromq.createSocket('pull');
      this.pullSocket.connect(options.recv_spec);
      this.pullSocket.on('message', __bind(function(message) {
        return this.emit('request', new MongrelRequest(message));
      }, this));
      this.pullSocket.on('error', __bind(function(e) {
        return this.emit('error', e);
      }, this));
      this.pubSocket = zeromq.createSocket('pub');
      this.pubSocket.connect(options.send_spec);
      this.pubSocket.on('error', __bind(function(e) {
        return this.emit('error', e);
      }, this));
    }
    Handler.prototype.sendResponse = function(request, response) {
      var header, outBuffer;
      header = [request.uuid, ' ', request.connectionId.length, ':', request.connectionId, ', '].join('');
      outBuffer = new Buffer(header.length + response.length);
      outBuffer.write(header, 'ascii');
      response.copy(outBuffer, header.length);
      return this.pubSocket.send(outBuffer);
    };
    return Handler;
  })();
  exports.Handler = Handler;
}).call(this);
