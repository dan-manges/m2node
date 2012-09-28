http = require 'http'
express = require 'express'
m2node = require 'm2node'

app = express()

app.get('/', (req, res) ->
  res.send('Hello World')
)

m2node.run(
  http.createServer(app),
  send_spec: 'tcp://127.0.0.1:9996'
  recv_spec: 'tcp://127.0.0.1:9997'
)
