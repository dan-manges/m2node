http = require 'http'
m2node = require '../lib/m2node'

server = http.createServer((req, res) ->
  console.log("#{req.method} #{req.url}")
  if req.url == '/'
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('Hello World\n')
  else if req.url.match /echo_request_url/
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end(req.url)
  else if req.url == '/echo_headers'
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end(JSON.stringify(req.headers))
  else if req.url == '/set_response_header'
    res.statusCode = 200
    res.setHeader('X-CustomResponseHeader', 'm2node')
    res.end('OK')
  else if req.url == '/echo_body'
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

json_handler = (req, res) ->
  console.log req.path
  payload = JSON.parse(req.body)
  if payload.a == 'お'
    res.end message: "hi お早う"
  else
    res.end message: "did not receive expected request"

handler = m2node.run(
  server,
  json_handler: json_handler
  send_spec: 'tcp://127.0.0.1:9996'
  recv_spec: 'tcp://127.0.0.1:9997'
)

console.log('Ready...')

