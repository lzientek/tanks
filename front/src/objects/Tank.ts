import 'phaser';
import { Scene } from 'phaser';
import { Bullet } from '../objects/Bullet';
import GameScene from '../scenes/GameScene';
import Collide from '../interface/Collide';
import { Client } from '../socket/Client';
import Player from '../socket/Player';
import Move from '../interface/Move';

export class Tank extends Phaser.GameObjects.Container implements Collide {
    tankBody: Phaser.GameObjects.Sprite;
    turret: Phaser.GameObjects.Sprite;
    body: Phaser.Physics.Arcade.Body;
    bullets: Phaser.GameObjects.Group;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    life: number;
    lastFiredBullet: number;
    lastReload: number;
    deathTime: number;
    availableBullets: number;
    maxBullets: number;
    reloadTime: number;
    scene: GameScene;
    client?: Client;
    player: Player;

    static preload(scene: Phaser.Scene): void {
        scene.load.image('tank', 'assets/Tank.png');
        scene.load.image('turret', 'assets/GunTurret.png');
    }

    constructor(scene: GameScene, x, y, client?: Client, maxBullet = 3, reloadTime = 1000, life = 3) {
        const tankBody = scene.add.sprite(0, 0, 'tank');
        tankBody.setScale(0.5, 0.5);
        tankBody.setDepth(40);

        const turret = scene.add.sprite(0, 0, 'turret');
        turret.setScale(1, 0.5);
        turret.setOrigin(0.5, 0.75);
        turret.setDepth(50);

        super(scene, x, y, [tankBody, turret]);

        this.setDepth(20);
        this.client = client;
        this.availableBullets = maxBullet;
        this.maxBullets = maxBullet;
        this.reloadTime = reloadTime;
        this.lastReload = this.scene.time.now;

        this.tankBody = tankBody;
        this.turret = turret;
        this.life = life;

        this.setSize(this.tankBody.displayHeight * 0.8, this.tankBody.displayHeight * 0.8);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.bullets = scene.add.group({
            classType: Bullet,
            runChildUpdate: true,
        });

        this.localControls(!!client);
        this.client?.move({ x: this.x, y: this.y, angle: this.angle, turretAngle: this.turret.angle });
    }

    setPlayer(p: Player): void {
        this.player = p;
        this.player.setFunctions(this.onMove.bind(this), null);
    }

    update(time: number): void {
        if (time - this.deathTime > 2000) {
            this.setActive(false);
            this.setVisible(false);
        } else if (this.deathTime) {
            if ((time - this.deathTime) % 400 < 300) {
                this.setVisible(false);
            } else {
                this.setVisible(true);
            }
        } else if (this.client) {
            this.bodyMoves(this.cursors);
            this.turretMoves();
            this.reload(time);
        }
    }

    onMove(m: Move): void {
        this.setX(m.x);
        this.setY(m.y);
        this.setAngle(m.angle);
        this.turret.setAngle(m.turretAngle);
    }

    onCollide(bullet: Bullet): void {
        this.life--;
        console.log('collide');

        if (this.life <= 0) {
            console.log('Explode');
            this.deathTime = this.scene.time.now;
            this.scene.physics.world.disable(this);
        }
        bullet.onCollide(true);
    }

    getScene(): Scene {
        return this.scene;
    }

    private bodyMoves(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        this.body.setAngularVelocity(0);
        this.body.setVelocity(0);

        if (cursors.left.isDown) {
            this.body.setAngularVelocity(-200);
        } else if (cursors.right.isDown) {
            this.body.setAngularVelocity(200);
        }

        if (cursors.up.isDown) {
            this.body.velocity.copy(this.scene.physics.velocityFromAngle(this.angle - 90, 100)); //+90 to start at the front of the sprite
        } else if (cursors.down.isDown) {
            this.body.velocity.copy(this.scene.physics.velocityFromAngle(this.angle + 90, 80));
        }

        if (this.client) {
            this.client.move({ x: this.x, y: this.y, angle: this.angle, turretAngle: this.turret.angle });
        }
    }

    private turretMoves(): void {
        const mousePosition = this.scene.input.mousePointer.position;
        this.turret.setRotation(
            Phaser.Math.Angle.Between(mousePosition.x, mousePosition.y, this.x, this.y) -
                Phaser.Math.DegToRad(this.angle) -
                Math.PI / 2,
        );
    }

    private reload(time: number): void {
        if (
            time - this.lastFiredBullet > this.reloadTime &&
            time - this.lastReload > this.reloadTime &&
            this.availableBullets < this.maxBullets
        ) {
            this.availableBullets++;
            this.lastReload = time;
        }
    }

    private localControls(isLocal: boolean): void {
        if (isLocal) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
            this.scene.input.on(
                'pointerdown',
                () => {
                    if (this.deathTime) {
                        return;
                    }
                    const bullet = this.bullets.get() as Bullet;
                    if (bullet && this.availableBullets > 0) {
                        bullet.fire(this.x, this.y, this.turret.angle + this.angle);
                        this.availableBullets--;
                        this.lastFiredBullet = this.scene.time.now;
                    }
                },
                this,
            );
        }
    }
}
