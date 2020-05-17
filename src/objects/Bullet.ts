export class Bullet extends Phaser.Physics.Arcade.Sprite {
    speed: number;
    velocity: Phaser.Math.Vector2;

    constructor(scene) {
        super(scene, 0, 0, 'bullet');
        this.setScale(0.5);
        this.setActive(false);
        this.setVisible(false);
    }

    fire(x: number, y: number, angle: number): void {
        this.setPosition(x, y);
        this.setAngle(angle);
        this.velocity = this.scene.physics.velocityFromAngle(angle - 90, 300);
        this.scene.physics.world.enable(this);
        this.setActive(true);
        this.setVisible(true);
    }

    update(): void {
        if (this.active && this.velocity) {
            this.body.velocity.copy(this.velocity); //+90 to start at the front of the sprite
        }
    }
}
