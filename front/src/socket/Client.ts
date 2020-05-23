import io from 'socket.io-client';

export default class Client {
    socket: SocketIOClient.Socket;
    constructor() {
        this.socket = io.connect('http://localhost:3001');
    }

    move(x: number, y: number): void {
        console.log(this);
        this.socket.emit('move', { x, y });
    }
}
