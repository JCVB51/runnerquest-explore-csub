import Phaser from 'phaser';
import OverworldScene from './src/scenes/OverworldScene.js';

const config = {
    type: Phaser.AUTO,
    width: 640,   // 40 tiles × 16px
    height: 640,  // 40 tiles × 16px
    pixelArt: true,
    backgroundColor: '#000000',
    parent: 'game-container',

    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },

    scene: [OverworldScene]
};

new Phaser.Game(config);