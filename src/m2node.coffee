{FakeSocket} = require './m2node/fake_socket'
{Handler} = require './m2node/handler'

exports.version = '0.2.0'

exports.run = (server, options) ->
  handler = new Handler(options)
  handler.on 'request', (request) ->
    fakeSocket = new FakeSocket()
    fakeSocket.on 'write', ->
      handler.sendResponse(request, fakeSocket.writeBuffer)
    server.emit 'connection', fakeSocket
    fakeSocket.emitData(request.toFullHttpRequest())
  handler

