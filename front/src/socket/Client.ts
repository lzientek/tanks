import io from 'socket.io-client';

export default class Client {
    socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io.connect('http://localhost:3001');
    }

    previousX: number;
    previousY: number;
    move(x: number, y: number): void {
        if (x !== this.previousX || y !== this.previousY) {
            this.socket.emit('move', { x, y });
            this.previousY = y;
            this.previousX = x;
        }
    }
}
