import 'phaser';
import { Scene } from 'phaser';

export class Tank extends Phaser.GameObjects.Container {
    tankBody: Phaser.Physics.Arcade.Sprite;
    turret: Phaser.GameObjects.Sprite;
    body: Phaser.Physics.Arcade.Body;

    constructor(scene: Scene, x, y) {
        const tankBody = scene.physics.add.sprite(0, 0, 'tank');
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
    }

    tankMoves(cursors): void {
        this.body.setAngularVelocity(0);
        this.body.setVelocity(0);
        console.log(this.angle);

        if (cursors.left.isDown) {
            this.body.setAngularVelocity(-200);
        } else if (cursors.right.isDown) {
            this.body.setAngularVelocity(200);
        }

        console.log(this.angle);
        if (cursors.up.isDown) {
            this.body.velocity.copy(this.scene.physics.velocityFromAngle(this.angle - 90, 100)); //+90 to start at the front of the sprite
        } else if (cursors.down.isDown) {
            this.body.velocity.copy(this.scene.physics.velocityFromAngle(this.angle + 90, 100)); //-90 to go backwards
        }
    }
}
