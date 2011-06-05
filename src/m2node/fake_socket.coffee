sys = require 'sys'
util = require 'util'
events = require('events')

class FakeSocket extends events.EventEmitter
  constructor: ->
    @writeBuffer = new Buffer('')
    @writable = true

  destroy: -> # noop
  destroySoon: -> # noop

  emitData: (buffer) ->
    if (@_events && this._events['data'])
      @emit('data', buffer)
    if (@ondata)
      @ondata(buffer, 0, buffer.length)

  setTimeout: (timeout, callback) -> # noop

  write: (data) ->
    combinedBuffer = new Buffer(@writeBuffer.length + data.length)
    @writeBuffer.copy(combinedBuffer)
    combinedBuffer.write(data.toString(), @writeBuffer.length)
    @writeBuffer = combinedBuffer
    @emit('write')

exports.FakeSocket = FakeSocket
