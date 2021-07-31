var Players = [];

function Blob(id,name, x, y, r, mass,color) {
  this.id = id;
  this.name = name;
  this.x = x;
  this.y = y;
  this.r = r;
  this.mass = mass;
  this.color = color      ;
}


var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 5000, listen);


function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


var io = require('socket.io')(server);


setInterval(heartbeat, 33);

function heartbeat() {
  io.sockets.emit('heartbeat', Players);
}


io.sockets.on(
  'connection',
 
  function(socket) {
    console.log('We have a new client: ' + socket.id);

    socket.on('start', function(data) {
      var blob = new Blob(socket.id, data.name, data.x, data.y, data.r, data.mass, data.color);
      console.log(data.mass)
      Players.push(blob);
    });

    socket.on('update', function(data) {
      var blob;
      for (var i = 0; i < Players.length; i++) {
        if (socket.id == Players[i].id) {
          // console.log(Players[i])
          blob = Players[i];

        }
      }
      blob.x = data.x;
      blob.y = data.y;
      blob.r = data.r;
      blob.mass = data.mass;
      
    });

    socket.on("killed", function(data) {
      Players[data.index].r = data.r;
      Players[data.index].mass = data.mass;
    })


    socket.on('disconnect', function() {
      for (var i = 0; i < Players.length; i++) {
        if (socket.id == Players[i].id) {
          Players.splice(i, 1);
        }
      }
      console.log('Client has disconnected');
      console.log(Players);
    });
  }
);
