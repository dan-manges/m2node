class MongrelRequest
  constructor: (messageBuffer) ->
    [@uuid, position] = @_stringUntilDelimiter messageBuffer
    [@connectionId, position] = @_stringUntilDelimiter messageBuffer, position
    [@path, position] = @_stringUntilDelimiter messageBuffer, position
    [rawHeaders, position] = @_stringFromNetstring messageBuffer, position
    @headers = if rawHeaders then JSON.parse rawHeaders else {}
    [@body, _] = @_stringFromNetstring messageBuffer, position

  toFullHttpRequest: ->
    request = []
    request.push @headers.METHOD + ' ' + @headers.URI + ' HTTP/1.1\r\n'
    for k, v of @headers when k.match(/^[^A-Z]+$/)
      request.push "#{k}: #{v}\r\n"
    request.push "\r\n"
    request.push @body
    new Buffer(request.join(''))

  _stringUntilDelimiter: (buffer, position = 0, delimiter = 0x20) ->
    string = null
    index = position
    while index < buffer.length
      if buffer[index] == delimiter
        # Pull out the string (utf8)
        string = buffer.toString('utf8', position, index)
        # Set position to the next string
        position = index + 1
        break
      index++
    [string, position]

  _stringFromNetstring: (buffer, position = 0) ->
    string = null
    index = position
    while ++index < buffer.length
      if buffer[index] == 0x3a  # ':'
        # Parse the length of the data (ascii numbers)
        len = parseInt buffer.toString 'ascii', position, index
        # Skip over the delimiter
        index++
        # Pull out the string (utf8)
        string = buffer.toString('utf8', index, index + len)
        # Set position to the next length
        position = index + len + 1
        break
    [string, position]

  _splitString: (string, delimiter, limit) ->
    result = string.split(delimiter)
    result.slice(0, limit - 1).concat([result.slice(limit - 1).join(delimiter)])

exports.MongrelRequest = MongrelRequest
