import 'phaser';
import { Tank } from '../objects/Tank';
import { Bullet } from '../objects/Bullet';

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
        Bullet.preload(this);
        Tank.preload(this);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create(): void {
        this.tank = new Tank(this, this.cameras.main.centerX, this.cameras.main.centerY);
    }

    update(time): void {
        this.tank.update(time, this.cursors);
    }
}
