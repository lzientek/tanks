import 'phaser';

export default interface WorldBounds {
    onWorldBounds(
        body: Phaser.Physics.Arcade.Body,
        up?: boolean,
        down?: boolean,
        left?: boolean,
        right?: boolean,
    ): void;
}
