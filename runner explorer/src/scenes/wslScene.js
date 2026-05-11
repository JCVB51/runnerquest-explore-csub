import Phaser from 'phaser';

export default class WslScene extends Phaser.Scene {

    constructor() {
        super('WslScene');
    }

    preload() {
        this.load.tilemapTiledJSON('wsl', 'assets/maps/wsl.tmj');
    }

    create() {
        const map = this.make.tilemap({ key: 'wsl' });


        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('OverworldScene');
        });
    }
}