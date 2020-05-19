import 'phaser';

export default interface Collide {
    onCollide(
        obj1: Phaser.GameObjects.GameObject | Phaser.Physics.Arcade.Body,
        obj2?: Phaser.GameObjects.GameObject,
    ): void;
}
