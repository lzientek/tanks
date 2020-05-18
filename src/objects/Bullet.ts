export class Bullet extends Phaser.Physics.Arcade.Sprite {
    speed: number;
    velocity: Phaser.Math.Vector2;

    static preload(scene: Phaser.Scene): void {
        scene.load.image('bullet', 'assets/Bullet.png');
    }

    constructor(scene) {
        super(scene, 0, 0, 'bullet');
        this.setScale(0.5);
        this.setActive(false);
        this.setVisible(false);
    }

    fire(x: number, y: number, angle: number): void {
        this.setPosition(x, y);
        this.setAngle(angle);
        this.scene.physics.world.enable(this);
        this.setActive(true);
        this.setVisible(true);
        this.setCollideWorldBounds(true);
        this.setBounce(1);
        this.body.velocity.copy(this.scene.physics.velocityFromAngle(angle - 90, 300));
    }

    update(): void {}
}
