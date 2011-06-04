(function() {
  var FakeSocket, Handler;
  FakeSocket = require('./m2node/fake_socket').FakeSocket;
  Handler = require('./m2node/handler').Handler;
  exports.version = '0.1.0';
  exports.run = function(server, options) {
    var handler;
    handler = new Handler(options);
    return handler.on('request', function(request) {
      var fakeSocket;
      fakeSocket = new FakeSocket();
      fakeSocket.on('write', function() {
        return handler.sendResponse(request, fakeSocket.writeBuffer);
      });
      server.emit('connection', fakeSocket);
      return fakeSocket.emitData(request.toFullHttpRequest());
    });
  };
}).call(this);
