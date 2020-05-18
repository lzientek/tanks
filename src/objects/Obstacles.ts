import 'phaser';

export class Obstacles extends Phaser.Physics.Arcade.StaticGroup {
    static preload(scene: Phaser.Scene): void {
        scene.load.image('ground', 'assets/platform.png');
    }

    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene);

        this.create(400, 568, 'ground');
        this.create(600, 400, 'ground');
        this.create(50, 250, 'ground');
        this.create(750, 220, 'ground');
    }
}
