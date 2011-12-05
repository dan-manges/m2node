{FakeSocket} = require './m2node/fake_socket'
{Handler} = require './m2node/handler'

exports.version = '0.1.2'

exports.run = (server, options) ->
  handler = new Handler(options)
  handler.on 'request', (request) ->
    fakeSocket = new FakeSocket()
    fakeSocket.on 'write', ->
      handler.sendResponse(request, fakeSocket.writeBuffer)
      handler.emit 'response'
    server.emit 'connection', fakeSocket
    fakeSocket.emitData(request.toFullHttpRequest())
  handler

