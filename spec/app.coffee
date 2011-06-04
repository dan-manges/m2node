http = require 'http'
m2node = require '../lib/m2node'

server = http.createServer((req, res) ->
  console.log("#{req.method} #{req.url}")
  switch req.url
    when '/'
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end('Hello World\n')
    when '/echo_headers'
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end(JSON.stringify(req.headers))
    when '/set_response_header'
      res.statusCode = 200
      res.setHeader('X-CustomResponseHeader', 'm2node')
      res.end('OK')
    when '/echo_body'
      body = ''
      req.on('data', (data) ->
        body += data
      )
      req.on('end', ->
        res.statusCode = 200
        res.end(body)
      )
    else
      res.writeHead(404, {})
      res.end("Could not find page: #{req.url}")
)

m2node.run(
  server,
  send_spec: 'tcp://127.0.0.1:9996'
  recv_spec: 'tcp://127.0.0.1:9997'
)
console.log('Ready...')

