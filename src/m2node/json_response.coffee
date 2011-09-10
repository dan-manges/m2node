sys = require 'sys'
util = require 'util'
events = require 'events'

class JSONResponse extends events.EventEmitter
  constructor: ->
    @writeBuffer = null

  end: (data) ->
    @writeBuffer = new Buffer JSON.stringify(data)
    @emit('write')

exports.JSONResponse = JSONResponse
