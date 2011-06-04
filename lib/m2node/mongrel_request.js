(function() {
  var MongrelRequest;
  MongrelRequest = (function() {
    function MongrelRequest(messageBuffer) {
      var bodyNS, headersAndBody, message, rawHeaders, _ref, _ref2;
      message = messageBuffer.toString();
      _ref = this._splitString(message, ' ', 4), this.uuid = _ref[0], this.connectionId = _ref[1], this.path = _ref[2], headersAndBody = _ref[3];
      _ref2 = this._parseNetstring(headersAndBody), rawHeaders = _ref2[0], bodyNS = _ref2[1];
      this.body = this._parseNetstring(bodyNS)[0];
      this.headers = JSON.parse(rawHeaders);
    }
    MongrelRequest.prototype.toFullHttpRequest = function() {
      var k, request, v, _ref;
      request = [];
      request.push(this.headers.METHOD + ' ' + this.path + ' HTTP/1.1\r\n');
      _ref = this.headers;
      for (k in _ref) {
        v = _ref[k];
        request.push("" + k + ": " + v + "\r\n");
      }
      request.push("\r\n");
      request.push(this.body);
      return new Buffer(request.join(''));
    };
    MongrelRequest.prototype._parseNetstring = function(netstring) {
      var data, length, _ref;
      _ref = this._splitString(netstring, ':', 2), length = _ref[0], data = _ref[1];
      return [data.slice(0, parseInt(length)), data.slice(parseInt(length) + 1)];
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
