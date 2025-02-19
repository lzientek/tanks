export class Bullet extends Phaser.Physics.Arcade.Sprite {
    velocity: Phaser.Math.Vector2;
    body: Phaser.Physics.Arcade.Body;
    availableCollision: number;
    initialTime: number;

    static preload(scene: Phaser.Scene): void {
        scene.load.image('bullet', 'assets/Bullet.png');
    }

    constructor(scene) {
        super(scene, -50, -50, 'bullet');
        this.setScale(1);
        this.setActive(false);
        this.setVisible(false);
        this.setDepth(10);
    }

    onCollide(destroy = false): void {
        if (this.scene.time.now - this.initialTime < 100) {
            console.log('too early', this.initialTime, this.scene.time.now);
            return;
        }
        this.availableCollision--;

        if (this.availableCollision < 0 || destroy) {
            this.body.onWorldBounds = false;
            this.scene.physics.world.disable(this);

            this.setVelocity(0);
            this.setActive(false);
            this.setVisible(false);
        }
    }

    bulletToBulletCollision(): void {
        this.availableCollision = 0;
        this.body.onWorldBounds = false;
        this.scene.physics.world.disable(this);

        this.setVelocity(0);
        this.setActive(false);
        this.setVisible(false);
    }

    fire(x: number, y: number, angle: number): void {
        this.initialTime = this.scene.time.now;
        this.setPosition(x, y);
        this.setAngle(angle);
        this.scene.physics.world.enable(this);
        this.setCollideWorldBounds(true);

        this.setActive(true);
        this.setVisible(true);
        this.availableCollision = 1;
        this.setBounce(1);
        this.body.onWorldBounds = true;
        this.body.velocity.copy(this.scene.physics.velocityFromAngle(angle - 90, 300));
    }

    update(): void {
        if (this.body) {
            this.setAngle(Phaser.Math.RadToDeg(this.body.angle) + 90);
        }
    }
}
