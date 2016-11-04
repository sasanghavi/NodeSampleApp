#HomeWork 3 - Proxies, Queues, Cache#
Shrey Sanghavi
ssangha - Unity ID
###Tasks###
####1. set/get####

When /set is visited, a new key is set with the value:"this message will self-destruct in 10 seconds".
When /get is visited, that key is fetched, and value is sent back to the client.
If 10 seconds have passes, "No key found" message will be displayed

####2. recent####

/recent will display the 5 most recently visited sites.

####3. upload/meow####

Upload the image through curl command and view it in the browser by visiting /meow
`curl -F "image=@./img/morning.jpg" localhost:3000/upload`

`curl -F "image=@./img/i-scream.jpg" localhost:3000/upload`

`curl -F "image=@./img/hairypotter.jpg" localhost:3000/upload`

####4. spawn/destroy/listservers####

/spawn will create a new app server running on another port.

/destroy, which will destroy a random server.

/listservers shows a list of available servers.


####5. proxy####

Proxy server is running at port 4000 and delegates the request to one of the available servers spawned.

### Setup

* Clone this repo, run `npm install`.
* Install redis and run on localhost:6379
* Open two new terminal tabs and exceute ``` node main.js ``` and ``` node proxyServer.js```


###Screencast###

[Links]
[Part 1](https://youtu.be/tRcweEq2E2c)
[Part 2](https://youtu.be/RCbe04QkX7I)
