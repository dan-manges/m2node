{FakeSocket} = require './m2node/fake_socket'
{JSONResponse} = require './m2node/json_response'
{Handler} = require './m2node/handler'

exports.version = '0.1.2'

exports.run = (server, options) ->
  handler = new Handler(options)
  handler.on 'request', (request) ->
    fakeSocket = new FakeSocket()
    fakeSocket.on 'write', ->
      handler.sendResponse(request, fakeSocket.writeBuffer)
    server.emit 'connection', fakeSocket
    fakeSocket.emitData(request.toFullHttpRequest())
  handler.on 'json', (request) ->
    jsonResponse = new JSONResponse()
    jsonResponse.on 'write', ->
      handler.sendResponse(request, jsonResponse.writeBuffer)
    if options.json_handler
      options.json_handler request, jsonResponse
    else if request.path != "@*"
      # Only respond if this is not a system message
      jsonResponse.end({error:"No json_handler for m2node"})
  handler

