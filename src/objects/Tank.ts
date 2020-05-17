import 'phaser';
import { Scene } from 'phaser';
import { Bullet } from '../objects/Bullet';

export class Tank extends Phaser.GameObjects.Container {
    tankBody: Phaser.GameObjects.Sprite;
    turret: Phaser.GameObjects.Sprite;
    body: Phaser.Physics.Arcade.Body;
    bullets: Phaser.GameObjects.Group;

    constructor(scene: Scene, x, y) {
        const tankBody = scene.add.sprite(0, 0, 'tank');
        tankBody.setScale(0.5, 0.5);
        const turret = scene.add.sprite(0, 0, 'turret');
        turret.setScale(0.5, 0.5);
        turret.setOrigin(0.5, 0.75);

        super(scene, x, y, [tankBody, turret]);

        this.tankBody = tankBody;
        this.turret = turret;

        this.setSize(this.tankBody.width / 2, this.tankBody.height / 2);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.bullets = scene.add.group({
            classType: Bullet,
            runChildUpdate: true,
        });

        this.scene.input.on(
            'pointerdown',
            () => {
                const bullet = this.bullets.get() as Bullet;

                if (bullet) {
                    bullet.fire(this.x, this.y, this.turret.angle + this.angle);
                }
            },
            this,
        );
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        this.bodyMoves(cursors);
        this.turretMoves();
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
            this.body.velocity.copy(this.scene.physics.velocityFromAngle(this.angle + 90, 100));
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

    getScene(): Scene {
        return this.scene;
    }
}
