import io from 'socket.io-client';
import equal from 'deep-equal';
import Player from './Player';
import Move from '../interface/Move';

export default class Client {
    socket: SocketIOClient.Socket;
    players: Player[] = [];

    constructor() {
        this.socket = io.connect('http://localhost:3001');
    }

    setNewPlayer(f: (move: Player) => void): void {
        this.socket.on('newplayer', (args: Move) => {
            const p = new Player(args.id, this.socket);
            this.players.push(p);

            f(p);
        });
    }

    previous: Omit<Move, 'id'>;
    move(m: Omit<Move, 'id'>): void {
        if (!equal(m, this.previous)) {
            this.socket.emit('move', m);
            this.previous = m;
        }
    }
}
