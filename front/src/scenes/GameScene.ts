import 'phaser';
import { Tank } from '../objects/Tank';
import { Bullet } from '../objects/Bullet';
import { Obstacles } from '../objects/Obstacles';
import Client from '../socket/Client';

export class GameScene extends Phaser.Scene {
    clientWS: Client;
    delta: number;
    lastStarTime: number;
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
    }

    create(): void {
        this.clientWS = new Client();
        this.tank = new Tank(this, this.cameras.main.centerX, this.cameras.main.centerY);
        this.tank.client = this.clientWS;
        this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body & { gameObject: Bullet }) =>
            body.gameObject.onCollide(),
        );

        this.obstacles = new Obstacles(this);
        this.ennemies = this.add.group([
            new Tank(this, 50, 50, true, 0, 1000, 5),
            new Tank(this, 450, 200, true, 0, 1000, 5),
        ]);
        this.ennemies.runChildUpdate = true;

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
        //fixme bullet to bullet with enemmis bullets ^^
    }

    update(time: number): void {
        this.tank.update(time);
    }
}
