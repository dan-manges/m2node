events = require 'events'
zeromq = require 'zeromq'

{MongrelRequest} = require './mongrel_request'

class Handler extends events.EventEmitter
  constructor: (options) ->
    @pullSocket = zeromq.createSocket('pull')
    @pullSocket.connect(options.recv_spec)
    @pullSocket.on 'message', (message) =>
      req = new MongrelRequest(message)
      if req.headers.METHOD == "JSON"
        @emit 'json', req
      else
        @emit 'request', req
    @pullSocket.on 'error', (e) =>
      @emit 'error', e
    @pubSocket = zeromq.createSocket('pub')
    @pubSocket.connect(options.send_spec)
    @pubSocket.on 'error', (e) =>
      @emit 'error', e

  sendResponse: (request, response) ->
    header = [
      request.uuid, ' ',
      request.connectionId.length, ':', request.connectionId,
      ', '
    ].join('')
    outBuffer = new Buffer(header.length + response.length)
    outBuffer.write(header, 'ascii')
    response.copy(outBuffer, header.length)
    @pubSocket.send(outBuffer)

exports.Handler = Handler
