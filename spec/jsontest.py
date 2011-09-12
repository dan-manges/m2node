#!/usr/bin/env python
#

import sys
import socket
import time
from base64 import b64decode
try:
    import json
except:
    import simplejson as json

proxy_port = 9000  # this is in the mongrel2.conf file (as "port") used to configure z2proxy
print "Connecting to proxy at port %d" % proxy_port
CONN = socket.socket()
CONN.connect(("127.0.0.1", proxy_port))

#
# Helper function to send/receive the messages (below)
#
def send_request(data):
    request = '@jsontest %s\x00' % (json.dumps(data))
    CONN.send(request)
    
def read_reply():
    reply = ""
    ch = CONN.recv(1)
    while ch != '\0':
        reply += ch
        ch = CONN.recv(1)
    return json.loads(b64decode(reply))

def assert_kv_equal(h, k, v):
    if k not in h:
        print "Error: key '%s' is not in hash %s" % (k, h)
        exit(1)
        
    if h[k] != v:
        print "Error: received %s expected %s => %s" % (h, k, v)
        exit(1)
    
def wait_for_user_return():
    print "[Press return to continue]"
    raw_input()

print "Sending request"
data = {'message': 'Hello World'}
send_request(data)

print "Waiting for reply"
reply = read_reply()
assert_kv_equal(reply, 'message', "hi")

print "Success"
