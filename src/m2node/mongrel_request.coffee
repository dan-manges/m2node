class MongrelRequest
  constructor: (messageBuffer) ->
    message = messageBuffer.toString()
    [@uuid, @connectionId, @path, headersAndBody] = @_splitString(message, ' ', 4)
    [rawHeaders, bodyNS] = @_parseNetstring(headersAndBody)
    [@body] = @_parseNetstring(bodyNS)
    @headers = JSON.parse(rawHeaders)

  toFullHttpRequest: ->
    request = []
    request.push @headers.METHOD + ' ' + @headers.URI + ' HTTP/1.1\r\n'
    for k, v of @headers
      request.push "#{k}: #{v}\r\n"
    request.push "\r\n"
    request.push @body
    new Buffer(request.join(''))

  _parseNetstring: (netstring) ->
    [length, data] = @_splitString(netstring, ':', 2)
    [data.slice(0, parseInt(length)), data.slice(parseInt(length) + 1)]

  _splitString: (string, delimiter, limit) ->
    result = string.split(delimiter)
    result.slice(0, limit - 1).concat([result.slice(limit - 1).join(delimiter)])


exports.MongrelRequest = MongrelRequest
