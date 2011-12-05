(function() {
  var FakeSocket, Handler;
  FakeSocket = require('./m2node/fake_socket').FakeSocket;
  Handler = require('./m2node/handler').Handler;
  exports.version = '0.1.2';
  exports.run = function(server, options) {
    var handler;
    handler = new Handler(options);
    handler.on('request', function(request) {
      var fakeSocket;
      fakeSocket = new FakeSocket();
      fakeSocket.on('write', function() {
        handler.sendResponse(request, fakeSocket.writeBuffer);
        return handler.emit('response');
      });
      server.emit('connection', fakeSocket);
      return fakeSocket.emitData(request.toFullHttpRequest());
    });
    return handler;
  };
}).call(this);
