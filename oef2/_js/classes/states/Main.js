export default class Main extends Phaser.State {

	preload(){
		console.log('Main preload');
		this.game.load.image('tile', 'assets/tile.png'); 
		// game is globale variabele dus gebruik je this in klasses elk element dat overerft krijgt het mee in de constructor
		this.game.load.image('player', 'assets/player.png');
	}

	create(){
		console.log('Main created');
		this.speed = 150;
		this.spacing = 250;
		this.teller = 0;
		this.intervalTime = this.spacing * 1000 / this.speed;
		//ophalen image afmetingen --> via cahce
		this.tileWidth = this.game.cache.getImage('tile').width;
		this.tileHeight = this.game.cache.getImage('tile').height;
		console.log(this.tileWidth + 'x' + this.tileHeight)
		//
		this.cursors = this.game.input.keyboard.createCursorKeys();
		//
		this.game.stage.backgroundColor = '479cde';
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.platforms = this.game.add.group();
		this.platforms.enableBody = true;
		this.platforms.createMultiple(250, 'tile');

		//this.addTile(Math.random() * this.game.world.width,0);

		this.timer = this.game.time.events.loop(this.intervalTime, this.addPlatform, this);
		this.initPlatforms();
		this.initPlayer();

		this.score = this.game.add.text(this.game.world.centerX, this.game.world.centerY-150, this.teller , { font: '30px Arial', fill: '#fff' });
	}

	update(){
		console.log('Main update');
		this.game.physics.arcade.collide(this.player, this.platforms);
		//
		if(this.cursors.left.isDown){
			this.player.body.velocity.x += -20;
		}
		if(this.cursors.right.isDown){
			this.player.body.velocity.x += 20;
		}
		if(this.cursors.up.isDown && this.player.body.wasTouching.down){
			this.player.body.velocity.y = -1000;
		}

		if(this.player.body.y >= 550){
			this.game.state.start('Main');
		}

	}

	initPlatforms(){
		let numPlatforms = 1 + Math.ceil(this.game.world.height / (this.spacing + this.tileHeight)); //
		for (let i = 0; i < numPlatforms; i++){
			this.addPlatform(i * this.spacing - this.tileHeight);
		}
	}

	initPlayer(){
		this.player = this.game.add.sprite(this.game.world.centerX, 
											this.game.world.height - (this.spacing * 2 + (3 *
											this.tileHeight)), 'player');
		this.player.anchor.setTo(0.5,1); //0.5 midden x
		this.game.physics.arcade.enable(this.player);
		//Make the player fall by applying gravity
		this.player.body.gravity.y = 2000;
		//Make the player collide with the game boundaries
		this.player.body.collideWorldBounds = true;
		//Make the player bounce a little
		this.player.body.bounce.y = 0.1;

	}

	addTile(x, y) {
		let tile = this.platforms.getFirstDead();
		//Reset it to the specified coordinates
		tile.reset(x, y);
		tile.body.velocity.y = this.speed;
		tile.body.immovable = true;
		//When the tile leaves the screen, kill it
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;
		return tile;
	}

	addPlatform(y = -this.tileHeight) {
		if(this.score){
			this.teller++;
			this.score.setText(this.teller);
		}
		let tilesNeeded = Math.ceil(this.game.world.width / this.tileWidth);
		//Add a hole randomly somewhere
		let hole = Math.floor(Math.random() * (tilesNeeded - 3)) + 1;
		//Keep creating tiles next to each other until we have an entire row
		//Don't add tiles where the random hole is
		for (let i = 0; i < tilesNeeded; i++){
			if (i !== hole && i !== hole + 1){
				this.addTile(i * this.tileWidth, y);
			}
		}
	}

			
		shutdown(){
			this.score.destroy();
			this.score = null;
		}



}