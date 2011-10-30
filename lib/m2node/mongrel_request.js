(function() {
  var MongrelRequest;
  MongrelRequest = (function() {
    function MongrelRequest(messageBuffer) {
      var position, rawHeaders, _, _ref, _ref2, _ref3, _ref4, _ref5;
      _ref = this._stringUntilDelimiter(messageBuffer), this.uuid = _ref[0], position = _ref[1];
      _ref2 = this._stringUntilDelimiter(messageBuffer, position), this.connectionId = _ref2[0], position = _ref2[1];
      _ref3 = this._stringUntilDelimiter(messageBuffer, position), this.path = _ref3[0], position = _ref3[1];
      _ref4 = this._stringFromNetstring(messageBuffer, position), rawHeaders = _ref4[0], position = _ref4[1];
      this.headers = rawHeaders ? JSON.parse(rawHeaders) : {};
      _ref5 = this._stringFromNetstring(messageBuffer, position), this.body = _ref5[0], _ = _ref5[1];
    }
    MongrelRequest.prototype.toFullHttpRequest = function() {
      var k, request, v, _ref;
      request = [];
      request.push(this.headers.METHOD + ' ' + this.headers.URI + ' HTTP/1.1\r\n');
      _ref = this.headers;
      for (k in _ref) {
        v = _ref[k];
        if (k.match(/^[^A-Z]+$/)) {
          request.push("" + k + ": " + v + "\r\n");
        }
      }
      request.push("\r\n");
      request.push(this.body);
      return new Buffer(request.join(''));
    };
    MongrelRequest.prototype._stringUntilDelimiter = function(buffer, position, delimiter) {
      var index, string;
      if (position == null) {
        position = 0;
      }
      if (delimiter == null) {
        delimiter = 0x20;
      }
      string = null;
      index = position;
      while (index < buffer.length) {
        if (buffer[index] === delimiter) {
          string = buffer.toString('utf8', position, index);
          position = index + 1;
          break;
        }
        index++;
      }
      return [string, position];
    };
    MongrelRequest.prototype._stringFromNetstring = function(buffer, position) {
      var index, len, string;
      if (position == null) {
        position = 0;
      }
      string = null;
      index = position;
      while (++index < buffer.length) {
        if (buffer[index] === 0x3a) {
          len = parseInt(buffer.toString('ascii', position, index));
          index++;
          string = buffer.toString('utf8', index, index + len);
          position = index + len + 1;
          break;
        }
      }
      return [string, position];
    };
    MongrelRequest.prototype._splitString = function(string, delimiter, limit) {
      var result;
      result = string.split(delimiter);
      return result.slice(0, limit - 1).concat([result.slice(limit - 1).join(delimiter)]);
    };
    return MongrelRequest;
  })();
  exports.MongrelRequest = MongrelRequest;
}).call(this);
