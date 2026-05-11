import Phaser from 'phaser';

// each node is a location on the matrix that the player will walk to in a scripted route
// the idea is that we create scripted routes between nodes that will play when an arrow key is
// pressed, simulating the mario overworld traversal that we referenced when brainstorming this project
const NODES = {
    // top roundabout, starting loaction
    start: { col: 11, row: 12, label: 'Start'},

    // full traversal route from start to the wsl library
    wsl_path1: { col: 11, row: 15, label: '' },
    wsl_path2: { col: 20, row: 15, label: '' },
    library: { col: 20, row: 13, label: 'Walter Stiern Library'},

    // full traversal route from start to the crossroads
    // at the crossroads, the user can either go to the student union
    // or the student recreational center
    cross_path1:  { col: 11, row: 28, label: '' },
    cross_path2:  { col: 21, row: 28, label: '' },
    cross_path3:  { col: 21, row: 30, label: '' },
    cross_path4:  { col: 25, row: 30, label: '' },
    cross_path5:  { col: 25, row: 28, label: '' },
    cross_path6:  { col: 27, row: 28, label: '' },
    cross_path7:  { col: 27, row: 26, label: '' },
    crossroads: { col: 30, row: 26, label: 'Crossroads'},

    // route to the student union FROM THE CROSSROADS ONLY
    student_union: { col: 30, row: 22, label: 'Student Union' },

    // route to the student rec center FROM THE CROSSROADS ONLY
    src_path1: { col: 30, row: 39, label: '' },
    student_rec: { col: 32, row: 39, label: 'Student Recreational Center' }
};

const ROUTES = {

    // from start : library OR start : crossroads
    start: {
        right: ['wsl_path1', 'wsl_path2', 'library'],
        down:  ['cross_path1', 'cross_path2', 'cross_path3', 'cross_path4', 'cross_path5', 'cross_path6', 'cross_path7', 'crossroads']
    },

    // traverse back from the library to the starting point
    library: { left: ['wsl_path2', 'wsl_path1', 'start']},

    // from crossroads : start OR crossroads : student union OR crossroads : student recreational center
    crossroads: {
        left: ['cross_path7', 'cross_path6', 'cross_path5', 'cross_path4',
               'cross_path3', 'cross_path2', 'cross_path1', 'start'],
        up:   ['student_union'],
        down: ['src_path1', 'student_rec']
    },

    // traverse back to the crossroads from the student union
    student_union: {
        down: ['crossroads']
    },

    // traverse back to the crossroads from the student rec center
    student_rec: {
        left: ['src_path1', 'crossroads']
    }
};

const LOCATION_SCENES = {
    library:      'WslScene',
    student_union: 'SuScene',
    student_rec:  'SrcScene'
};

// calculate the node value to its pixel value
function nodePixel(node) {
    return {
        x: node.col * 16 + 8,
        y: node.row * 16 + 8
    };
}

export default class OverworldScene extends Phaser.Scene {

    constructor() {
        super('OverworldScene');
    }

    preload() {
        this.load.tilemapTiledJSON('overworld', 'assets/maps/csub_overworld.tmj');
        this.load.image('classic_rpg',  'assets/tilesets/ClassicRPG_Sheet.png');
        this.load.image('maple_tree',   'assets/tilesets/Maple Tree.png');
        this.load.image('spring_tiles', 'assets/tilesets/Tileset Spring.png');
        this.load.spritesheet('player', 'assets/sprites/Walk.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        const map = this.make.tilemap({ key: 'overworld' });

        const classicTiles = map.addTilesetImage('ClassicRPG_Sheet', 'classic_rpg');
        const mapleTiles   = map.addTilesetImage('Maple Tree',       'maple_tree');
        const springTiles  = map.addTilesetImage('farm rpg',         'spring_tiles');
        const allTiles     = [classicTiles, mapleTiles, springTiles];

        map.createLayer('Base Map',                    allTiles, 0, 0);
        map.createLayer('One Layer Level Above Base',  allTiles, 0, 0);
        map.createLayer('Two Layer Levels Above Base', allTiles, 0, 0);
        map.createLayer('Three Layers Above Base',     allTiles, 0, 0);
        map.createLayer('Tile Layer 5',                allTiles, 0, 0);
        map.createLayer('Tile Layer 6',                allTiles, 0, 0);
        map.createLayer('Tile Layer 7',                allTiles, 0, 0);
        map.createLayer('Tile Layer 8',                allTiles, 0, 0);

        const spawnPixel = nodePixel(NODES.start);
        this.player = this.add.sprite(spawnPixel.x, spawnPixel.y, 'player');
        this.player.setOrigin(0.5, 0.5);
        this.player.setDepth(10);

        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 1
        });

        this.player.anims.play('idle');

        this.currentNode = 'start';
        this.isWalking = false;

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    // walkQueue method, allow user to pass in the list of queues they have to hit, then traverse through it
    walkQueue(queue) {
        // player finished walking and went through full list of movements
        if (queue.length === 0) {
            this.isWalking = false;
            this.player.anims.play('idle');
            this.player.setFlipX(false);
            console.log(`Arrived at: ${this.currentNode} — "${NODES[this.currentNode].label}"`);
            return;
        }

        // player still have movement to go through
        const nextKey = queue.shift();
        const target = NODES[nextKey];
        const { x: tx, y: ty } = nodePixel(target);

        const dx = tx - this.player.x;
        const dy = ty - this.player.y;
        const dist = Math.hypot(dx, dy);
        const duration = (dist / 80) * 1000;

        // calculate which way is the player walking so we can set the walking animation
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDx >= absDy) {
            if (dx > 0) {
                this.player.setFlipX(false);
                this.player.anims.play('walk-right', true);
            } else {
                // mirror and walk left
                this.player.setFlipX(true);
                this.player.anims.play('walk-right', true);
            }
        } else {
            this.player.setFlipX(false);
            if (dy > 0) {
                this.player.anims.play('walk-down', true);
            } else {
                this.player.anims.play('walk-up', true);
            }
        }

        this.tweens.add({
            targets: this.player,
            x: tx,
            y: ty,
            duration,
            ease: 'Linear',
            onComplete: () => {
                this.currentNode = nextKey;
                this.walkQueue(queue);
            }
        });
    }

    update() {
        if (this.isWalking) return;

        const routes = ROUTES[this.currentNode];
        if (!routes) return;

        if (Phaser.Input.Keyboard.JustDown(this.cursors.right) && routes.right) {
            this.isWalking = true;
            this.walkQueue([...routes.right]);

        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.left) && routes.left) {
            this.isWalking = true;
            this.walkQueue([...routes.left]);

        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && routes.up) {
            this.isWalking = true;
            this.walkQueue([...routes.up]);

        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down) && routes.down) {
            this.isWalking = true;
            this.walkQueue([...routes.down]);
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            const sceneKey = LOCATION_SCENES[this.currentNode];
            if (sceneKey) {
                this.scene.start(sceneKey);
            }
        }

    }
}