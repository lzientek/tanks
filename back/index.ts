import express from 'express';
import {Server} from 'http';
import socket from 'socket.io';
import { AddressInfo } from 'net';

const app = express();
const server = new Server(app);
const io = socket.listen(server);

let id = 1;
interface Player {
  id:number,
  x:number,
  y:number
}

server.listen(process.env.PORT || 3001, function() {
  console.log('Listening on '+(server.address()as AddressInfo)?.port);
});

io.on('connection', (socket: SocketIO.Socket& { player: Player })=>{
  console.log(socket);
  socket.player = {id: id++, x:34,y:34};

    socket.on('move', ()=> {
      socket.broadcast.emit('move', socket.player);
    });

    socket.broadcast.emit('newplayer', socket.player);
    socket.on('disconnect', ()=>{
      io.emit('remove', socket.player.id);
    });

  socket.on('test', ()=>{
    console.log('test received');
  });
});


