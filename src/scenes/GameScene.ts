import 'phaser';
import { Tank } from '../objects/Tank';
import { Bullet } from '../objects/Bullet';
import { Obstacles } from '../objects/Obstacles';
import Collide from '../interface/Collide';
import { GameObjects } from 'phaser';

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
        this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body & { gameObject: Collide }, ...params) =>
            body.gameObject.onCollide(body),
        );

        this.obstacles = new Obstacles(this);

        this.physics.add.collider(this.tank, this.obstacles);
        this.physics.add.collider(this.tank.bullets, this.tank, (b: Bullet) => this.tank.onCollide(b));
        this.physics.add.collider(this.tank.bullets, this.obstacles, (bullet: Bullet) => bullet.onCollide());
    }

    update(time: number): void {
        this.tank.update(time, this.cursors);
    }
}
