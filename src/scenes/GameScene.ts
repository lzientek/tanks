import 'phaser';
import { Tank } from '../objects/Tank';

export class GameScene extends Phaser.Scene {
    delta: number;
    lastStarTime: number;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    tank: Tank;

    constructor() {
        super({
            key: 'GameScene',
        });
    }

    init(/*params: any*/): void {
        this.delta = 1000;
        this.lastStarTime = 0;
    }

    preload(): void {
        this.load.image('tank', 'assets/Tank.png');
        this.load.image('turret', 'assets/GunTurret.png');
        this.load.image('bullet', 'assets/Bullet.png');
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create(): void {
        this.tank = new Tank(this, this.cameras.main.centerX, this.cameras.main.centerY);
    }

    update(time): void {
        this.tank.update(time, this.cursors);
    }
}
