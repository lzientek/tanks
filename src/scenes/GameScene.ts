import 'phaser';
import { Tank } from '../objects/Tank';
import { Bullet } from '../objects/Bullet';
import { Obstacles } from '../objects/Obstacles';

export class GameScene extends Phaser.Scene {
    delta: number;
    lastStarTime: number;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    tank: Tank;
    obstacles: Obstacles;

    constructor() {
        super({
            key: 'GameScene',
        });
    }

    preload(): void {
        Bullet.preload(this);
        Tank.preload(this);
        Obstacles.preload(this);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create(): void {
        this.tank = new Tank(this, this.cameras.main.centerX, this.cameras.main.centerY);
        this.physics.world.on('worldbounds', (body, ...params) => body.gameObject.onWorldBounds(body, ...params));

        this.obstacles = new Obstacles(this);

        this.physics.add.collider(this.tank, this.obstacles);
        this.physics.add.collider(this.tank.bullets, this.obstacles);
    }

    update(time: number): void {
        this.tank.update(time, this.cursors);
    }
}
