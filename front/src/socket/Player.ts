import Move from '../interface/Move';

export default class Player {
    id: string;
    socket: SocketIOClient.Socket;
    onMove: (move: Move) => void;
    onBulletShot: Function;
    initialPosition: Move;

    constructor(id: string, initialPosition: Move, socket: SocketIOClient.Socket) {
        this.id = id;
        this.socket = socket;
        this.initialPosition = initialPosition;

        this.socket.on('move', ({ id, ...move }: Move) => {
            if (id === this.id && this.onMove) {
                this.onMove({ id, ...move });
            }
        });
    }

    setFunctions(onMove: (move: Move) => void, onBulletShot: Function): void {
        this.onMove = onMove;
        this.onBulletShot = onBulletShot;
    }
}
