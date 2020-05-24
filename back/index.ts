import express from 'express';
import { v4 as uuid } from 'uuid';
import { Server } from 'http';
import socket from 'socket.io';
import { AddressInfo } from 'net';

const app = express();
const server = new Server(app);
const io = socket.listen(server);

interface Player {
    id: string;
    x?: number;
    y?: number;
}

server.listen(process.env.PORT || 3001, function () {
    console.log('Listening on ' + (server.address() as AddressInfo)?.port);
});

io.on('connection', (socket: SocketIO.Socket & { player: Player }) => {
    socket.player = { id: uuid() };
    socket.on('getallplayers', () => {
        socket.emit(
            'newplayers',
            Object.entries(io.sockets.connected).map(([, s]: [string, any]) => s.player.id !== socket.player.id ? s.player :null).filter(p=>p),
        );
    });
  
    socket.on('move', (position) => {
        socket.player = { ...socket.player, ...position };
        socket.broadcast.emit('move', socket.player);
    });

    socket.broadcast.emit('newplayer', socket.player);
    socket.on('disconnect', () => {
        io.emit('remove', socket.player.id);
    });

    socket.on('test', () => {
        console.log('test received');
    });
});
