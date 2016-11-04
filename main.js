var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
var http = require('http')
var proxy_app = require('http-proxy')
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
var localhost = "http://localhost:"
var create_process = require('child_process').spawn
///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next)
{

    client.lpush('queue',req.url)

    // Trimming the queue to hold only the most recent 5 entries.
    client.ltrim('queue',0,4)

    next(); // Passing the request to the next handler in the stack.
});


app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){

   if( req.files.image )
   {
    fs.readFile( req.files.image.path, function (err, data) {
         if (err) throw err;
         var img = new Buffer(data).toString('base64');

         // Store the image in a redis queue
         client.lpush('imageQueue',img)
    });
 }

   res.status(204).end()
}]);



app.get('/meow', function(req, res) {

     res.writeHead(200, {'content-type':'text/html'});

     // Pop the image from the redis queue
     client.lpop('imageQueue',function(err,value){

        if (!value) {
            res.write("The image Queue is empty....!")
            res.end()
        }
        else {
            res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+value+"'/>");
            res.end();
        }
    })
})

//HTTP SERVER
var port;
var args = process.argv.slice(2);
if( args.length == 0 )
  {
    console.log("Using defual port number");
    defPort = 3000;
		port = 3000;
  }
  else
    port = args[0];

var server1 = app.listen(port, function () {

    var host1 = server1.address().address
    var port1 = server1.address().port

    console.log('Example app listening at http://%s:%s', host1, port1)
})


app.get('/', function(req, res) {
    res.send('hello world')
})

app.get('/set', function(req, res) {

    client.set("newKey", "this message will self-destruct in 10 seconds");
    client.expire("newKey",10)
    res.send('Key set successfully')
})

app.get('/get', function(req, res) {
    client.get("newKey", function(err,value){ if(value)res.send(value)
		else {
			res.send("No Key Found.")
		}});
})
app.get('/listservers', function(req,res){
  client.lrange('serverList', 0, -1, function(err, reply) {
        if(reply)
        {
					client.llen('serverList', function(err, reply){
						if (!err) {
							console.log("LLEN "+reply);
						}
					});
          value = 'Recently added servers:\n';
          res.send(value + reply);
        }
        else
          res.send('No Servers foundin the list')
    });
})

app.get('/spawn', function(req,res) {
	console.log("Old port "+port);
		client.llen('serverList', function(err, reply){
			if (!err) {
				port = port+reply+1
				console.log(port);
			}
		});
		console.log("New port "+port);
		client.lpush('serverList',port);
		client.llen('serverList', function(err, reply){
			if (!err) {
				console.log("LLEN "+reply);
			}
		});
		create_process('sh',['spawn_server.sh',port]);
    res.send("Started a new server on port " + port + " succesfully");
})

app.get('/destroy', function(req,res) {
    client.llen('serverList',function(err,reply) {
      console.log(reply);
      var len = reply;
      var port = 0;
      console.log('Length:' + len);
      var index = Math.floor(Math.random()*len);
      client.lrange('serverList',index,index,function(err, reply) {
        port = reply
        console.log('Stoping server on port : ' + port);
        if(port == defPort)
        {
          console.log('will not stop the default server');
          res.send('will not stop the default server');
        }
        else
        {
          client.lrem('serverList',1,port,function(err, reply) {
            create_process('sh',['kill_server.sh',port]);
            res.send('Success stopped the server at port : ' + port);
            console.log('Success stopped the server at port : ' + port);
          });
        }
      });
    });
})
app.get('/recent', function(req, res) {
    client.lrange('queue',0,4,function(err,value){ res.send("The 5 most recent visited sites are: " + value)} )
})
