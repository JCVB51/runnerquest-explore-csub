import Phaser from 'phaser';

export default class SrcScene extends Phaser.Scene {

    constructor() {
        super('SrcScene');
    }

    preload() {
        this.load.tilemapTiledJSON('src', 'assets/maps/src.tmj');

        this.load.image('adam',      'assets/tilesets/Adam_16x16.png');
        this.load.image('alex',      'assets/tilesets/Alex_16x16.png');
        this.load.image('amelia',    'assets/tilesets/Amelia_16x16.png');
        this.load.image('bob',       'assets/tilesets/Bob_16x16.png');
        this.load.image('room',      'assets/tilesets/Room_Builder_free_16x16.png');
        this.load.image('interiors', 'assets/tilesets/Interiors_free_16x16.png');

        this.load.spritesheet('player', 'assets/sprites/Walk.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        const map = this.make.tilemap({ key: 'src' });

        const adamTiles     = map.addTilesetImage('Adam_16x16',              'adam');
        const alexTiles     = map.addTilesetImage('Alex_16x16',              'alex');
        const ameliaTiles   = map.addTilesetImage('Amelia_16x16',            'amelia');
        const bobTiles      = map.addTilesetImage('Bob_16x16',               'bob');
        const roomTiles     = map.addTilesetImage('Room_Builder_free_16x16', 'room');
        const interiorTiles = map.addTilesetImage('Interiors_free_16x16',    'interiors');

        const allTiles = [adamTiles, alexTiles, ameliaTiles, bobTiles, roomTiles, interiorTiles];

        map.createLayer('Floor',        allTiles, 0, 0);
        map.createLayer('Floor Border', allTiles, 0, 0);
        map.createLayer('Tiles',        allTiles, 0, 0);

        // furniture blocks movement
        const furnitureLayer = map.createLayer('Furniture', allTiles, 0, 0);
        furnitureLayer.setCollisionByExclusion([-1]);

        this.player = this.physics.add.sprite(
            map.widthInPixels / 2,
            map.heightInPixels / 2,
            'player'
        );
        this.player.setOrigin(0.5, 0.5);
        this.player.setDepth(10);
        this.player.setCollideWorldBounds(true);
        this.player.setSize(12, 12);
        this.player.setOffset(10, 18);

        this.physics.add.collider(this.player, furnitureLayer);

        this.peopleLayer = map.createLayer('People\/Accessories', allTiles, 0, 0).setDepth(12);

        this.map = map;

        this.anims.create({
            key: 'src-walk-down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'src-walk-up',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'src-walk-right',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'src-idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 1
        });

        this.player.anims.play('src-idle');

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        const zoomX = this.scale.width  / map.widthInPixels;
        const zoomY = this.scale.height / map.heightInPixels;
        this.cameras.main.setZoom(Math.min(zoomX, zoomY));

        this.cursors = this.input.keyboard.createCursorKeys();

        this.chatboxVisible = false;
        this.chatbox = this.createChatbox();

        this.input.keyboard.on('keydown-SPACE', () => {
            this.hideChatbox();
            this.scene.start('OverworldScene', { returnNode: this.scene.key });
        });

        this.events.on('shutdown', () => {
            this.hideChatbox();
            const box = document.getElementById('src-chatbox');
            if (box) box.remove();
        });
    }

    // chatbox for when the user is in proximity of frontdesk, or the people layer is what i check the proximity of
    createChatbox() {
        const box = document.createElement('div');
        box.id = 'src-chatbox';
        box.style.cssText = `
            display: none;
            position: fixed;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            width: 520px;
            max-width: 90vw;
            background: rgba(0, 26, 77, 0.97);
            border: 3px solid #FFC72C;
            box-shadow: 4px 4px 0 0 rgba(0,0,0,0.5);
            padding: 16px 20px;
            z-index: 200;
            font-family: 'Rajdhani', sans-serif;
        `;

        box.innerHTML = `
            <div style="
                font-family: 'Press Start 2P', monospace;
                font-size: 8px;
                color: #FFC72C;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                <span>💬</span> SRC STAFF
            </div>
            <p style="
                color: white;
                font-size: 14px;
                line-height: 1.6;
                margin: 0 0 10px 0;
            ">
                Welcome to the <strong style="color:#FFC72C;">SRC</strong>, our campus recreation and wellbeing facility.
            </p>
            <p style="
                color: white;
                font-size: 13px;
                line-height: 1.8;
                margin: 0 0 10px 0;
            ">
                Our Spring 2026 Hours:<br>
                <strong style="color:#FFC72C;">Mon – Thu</strong> 6:00am – 11:00pm<br>
                <strong style="color:#FFC72C;">Friday</strong> 6:00am – 10:00pm<br>
                <strong style="color:#FFC72C;">Saturday</strong> 9:00am – 6:00pm<br>
                <strong style="color:#FFC72C;">Sunday</strong> 12:00pm – 7:00pm
            </p>
            <p style="
                color: white;
                font-size: 14px;
                line-height: 1.6;
                margin: 0;
            ">
                Stay connected and follow us on Instagram, Facebook, and TikTok at
                <strong style="color:#FFC72C;">@csubsrc</strong>
            </p>
            <div style="
                font-family: 'Press Start 2P', monospace;
                font-size: 7px;
                color: #4a6fa5;
                margin-top: 12px;
            ">
                [ WALK AWAY TO DISMISS ]
            </div>
        `;

        document.body.appendChild(box);
        return box;
    }

    showChatbox() {
        if (this.chatboxVisible) return;
        this.chatbox.style.display = 'block';
        this.chatboxVisible = true;
    }

    hideChatbox() {
        if (!this.chatboxVisible) return;
        this.chatbox.style.display = 'none';
        this.chatboxVisible = false;
    }

    // player proximity of a people layer object
    isNearPerson() {
        const TILE_SIZE = 16;
        const PROXIMITY = 3;

        const playerTileX = Math.floor(this.player.x / TILE_SIZE);
        const playerTileY = Math.floor(this.player.y / TILE_SIZE);

        for (let dy = -PROXIMITY; dy <= PROXIMITY; dy++) {
            for (let dx = -PROXIMITY; dx <= PROXIMITY; dx++) {
                const tile = this.peopleLayer.getTileAt(
                    playerTileX + dx,
                    playerTileY + dy
                );
                if (tile && tile.index !== -1) {
                    return true;
                }
            }
        }

        return false;
    }

    update() {
        const speed = 80;
        const { left, right, up, down } = this.cursors;

        this.player.setVelocity(0, 0);

        let moving = false;

        if (left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
            this.player.anims.play('src-walk-right', true);
            moving = true;
        } else if (right.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
            this.player.anims.play('src-walk-right', true);
            moving = true;
        } else if (up.isDown) {
            this.player.setVelocityY(-speed);
            this.player.setFlipX(false);
            this.player.anims.play('src-walk-up', true);
            moving = true;
        } else if (down.isDown) {
            this.player.setVelocityY(speed);
            this.player.setFlipX(false);
            this.player.anims.play('src-walk-down', true);
            moving = true;
        }

        if (!moving) {
            this.player.anims.play('src-idle', true);
            this.player.setFlipX(false);
        }

        if (this.isNearPerson()) {
            this.showChatbox();
        } else {
            this.hideChatbox();
        }
    }
}