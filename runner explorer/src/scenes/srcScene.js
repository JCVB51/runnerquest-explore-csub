import Phaser from 'phaser';

export default class SrcScene extends Phaser.Scene {

    constructor() {
        super('SrcScene');
    }

    preload() {
        this.load.tilemapTiledJSON('src', 'assets/maps/src.tmj');
    }

    create() {
        const map = this.make.tilemap({ key: 'src' });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('OverworldScene');
        });
    }
}