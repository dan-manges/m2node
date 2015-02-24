util = require 'util'
events = require 'events'

class FakeSocket extends events.EventEmitter
  constructor: ->
    @writeBuffer = new Buffer('')
    @writable = true
    @_writableState = {needDrain : false};

  destroy: -> # noop
  destroySoon: -> # noop

  emitData: (buffer) ->
    if (@_events && this._events['data'])
      @emit('data', buffer)
    if (@ondata)
      @ondata(buffer, 0, buffer.length)

  setTimeout: (timeout, callback) -> # noop

  write: (data) ->
    @writeBuffer = new Buffer data
    @emit('write')

exports.FakeSocket = FakeSocket
