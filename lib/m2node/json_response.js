(function() {
  var JSONResponse, events, util;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  util = require('util');

  events = require('events');

  JSONResponse = (function() {

    __extends(JSONResponse, events.EventEmitter);

    function JSONResponse() {
      this.writeBuffer = null;
    }

    JSONResponse.prototype.end = function(data) {
      this.writeBuffer = new Buffer(JSON.stringify(data));
      return this.emit('write');
    };

    return JSONResponse;

  })();

  exports.JSONResponse = JSONResponse;

}).call(this);
