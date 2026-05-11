import Phaser from 'phaser';
import WslScene  from './src/scenes/wslScene.js';
import SuScene   from './src/scenes/suScene.js';
import SrcScene  from './src/scenes/srcScene.js';
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

    scene: [OverworldScene, WslScene, SuScene, SrcScene]
};

new Phaser.Game(config);