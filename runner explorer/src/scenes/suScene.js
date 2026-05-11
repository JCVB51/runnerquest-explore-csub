import Phaser from 'phaser';

export default class SuScene extends Phaser.Scene {

    constructor() {
        super('SuScene');
    }

    preload() {
        this.load.tilemapTiledJSON('su', 'assets/maps/student union.tmj');
    }

    create() {
        const map = this.make.tilemap({ key: 'su' });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('OverworldScene');
        });
    }
}