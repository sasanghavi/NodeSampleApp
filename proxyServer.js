var redis = require('redis')

var http = require('http');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer();
var client = redis.createClient(6379, '127.0.0.1', {})

http.createServer(function (req, res) {

  var target;
  client.rpoplpush("serverList","serverList", function(err, reply) {
    client.lindex("serverList",0, function(err, reply) {
      if(reply >= 0 && reply < 65536){
        target = 'http://localhost:' + reply;
        console.log('Target server is at: %s', target);
      }
      else
        target = 'http:localhost:3000'

      proxy.web(req, res, {
        target: target
      });

    });
  })

}).listen(4000);
