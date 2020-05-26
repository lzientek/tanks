import 'phaser';
import { Tank } from '../objects/Tank';
import { Bullet } from '../objects/Bullet';
import { Obstacles } from '../objects/Obstacles';
import client from '../socket/Client';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'HomeScene',
        });
    }

    preload(): void {
        Bullet.preload(this);
        Tank.preload(this);
        Obstacles.preload(this);
        this.load.html('nameform', 'assets/username.html');
    }

    create(): void {
        const element = this.add.dom(170, 250).createFromCache('nameform');
        element.setPerspective(800);
        this.add.text(100, 100, 'Tanks!', { font: '64px Arial' });
        this.add.text(100, 200, 'Username:', { font: '24px Arial' });

        element.addListener('click');
        element.on('click', (event) => {
            if (event.target.name === 'playButton') {
                const inputUsername = element.getChildByName('username') as HTMLInputElement;

                if (inputUsername.value !== '') {
                    element.removeListener('click'); // maybe useless
                    console.log('Connect to a room...');
                    this.scene.start('GameScene', { value: inputUsername.value });
                }
            }
        });
    }

    update(time: number): void {}
}
