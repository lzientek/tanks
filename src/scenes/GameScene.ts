import 'phaser';

export class GameScene extends Phaser.Scene {
    delta: number;
    lastStarTime: number;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    tank: Phaser.Physics.Arcade.Sprite;

    constructor() {
        super({
            key: 'GameScene',
        });
    }

    init(/*params: any*/): void {
        this.delta = 1000;
        this.lastStarTime = 0;
    }

    preload(): void {
        this.load.image('tank', 'assets/Tank.png');
        this.load.image('turret', 'assets/GunTurret.png');
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create(): void {
        this.tank = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'tank');
        this.tank.setScale(0.5, 0.5);
        this.tank.setCollideWorldBounds(true);
    }

    update(time): void {
        this.tankMoves();

        if (this.cursors.up.isDown && this.tank.body.touching.down) {
            this.tank.setVelocityY(-330);
        }
    }

    private tankMoves(): void {
        if (this.cursors.left.isDown) {
            this.tank.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.tank.setVelocityX(160);
        } else if (this.cursors.up.isDown) {
            this.tank.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.tank.setVelocityY(160);
        } else {
            this.tank.setVelocityX(0);
            this.tank.setVelocityY(0);
        }
    }
}
