import 'phaser';
import GameScene from './scenes/GameScene';
import HomeScene from './scenes/HomeScene';

const config: Phaser.Types.Core.GameConfig = {
    title: 'Tanks',
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: '#f5b642',
    scene: [HomeScene, GameScene],
    dom: {
        createContainer: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
};

export class TankGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.onload = (): void => {
    new TankGame(config);
};
