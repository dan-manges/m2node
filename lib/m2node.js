(function() {
  var FakeSocket, Handler, JSONResponse;
  FakeSocket = require('./m2node/fake_socket').FakeSocket;
  JSONResponse = require('./m2node/json_response').JSONResponse;
  Handler = require('./m2node/handler').Handler;
  exports.version = '0.1.2';
  exports.run = function(server, options) {
    var handler;
    handler = new Handler(options);
    handler.on('request', function(request) {
      var fakeSocket;
      fakeSocket = new FakeSocket();
      fakeSocket.on('write', function() {
        return handler.sendResponse(request, fakeSocket.writeBuffer);
      });
      server.emit('connection', fakeSocket);
      return fakeSocket.emitData(request.toFullHttpRequest());
    });
    handler.on('json', function(request) {
      var jsonResponse;
      jsonResponse = new JSONResponse();
      jsonResponse.on('write', function() {
        return handler.sendResponse(request, jsonResponse.writeBuffer);
      });
      if (options.json_handler) {
        return options.json_handler(request, jsonResponse);
      } else {
        return jsonResponse.write({
          error: "Not Found"
        });
      }
    });
    return handler;
  };
}).call(this);
