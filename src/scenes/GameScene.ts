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
    ennemies: Phaser.GameObjects.Group;
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
        this.ennemies = this.add.group([new Tank(this, 50, 50, 0, 1000, 5), new Tank(this, 450, 200, 0, 1000, 5)]);

        this.physics.add.collider(this.tank, this.obstacles);
        this.physics.add.collider(this.ennemies, this.obstacles);
        this.physics.add.collider(this.tank, this.ennemies);
        this.physics.add.collider(this.tank.bullets, this.ennemies, (b: Bullet, ennemy: Tank) => ennemy.onCollide(b));
        this.physics.add.collider(this.tank.bullets, this.tank, (b: Bullet) => this.tank.onCollide(b));
        this.physics.add.collider(this.tank.bullets, this.obstacles, (bullet: Bullet) => bullet.onCollide());
        this.physics.add.collider(this.tank.bullets, this.tank.bullets, (b1: Bullet, b2: Bullet) => {
            b1.bulletToBulletCollision();
            b2.bulletToBulletCollision();
        });
    }

    update(time: number): void {
        this.tank.update(time, this.cursors);
    }
}
