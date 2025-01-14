class SceneMain extends Phaser.Scene{
    constructor(){
        super('gameStart'); 
    }

    preload = function() {
        this.load.image("player",'../assets/image/player.png');
        this.load.image("tiles",'../assets/image/ozone.png');
        this.load.image("laser",'../assets/image/laser.png');  
        this.load.image("factory", '../assets/image/factory.png');
        this.load.image("ozone", '../assets/image/ozone.jpg');
        this.load.image("ozone2", '../assets/image/ozone2.jpg');
        this.load.image("gas", '../assets/image/gases.png');
        this.load.image("back2", '../assets/image/back2.webp');
        this.load.tilemapTiledJSON('map', '../assets/maps/ozoneMap2.json');
        this.load.audio('gdestroy', '../assets/audio/gasdestroy.wav');
    }
    
    create = function() {
        //=============================add player==============================
        this.player = this.physics.add.image(500,566,"player");
        this.factory = this.physics.add.image(1000,500,"factory").setImmovable().setScale(0.7);
        this.ozone = this.physics.add.image(1000,-1200,"ozone").setImmovable().setScale(15).setDepth(-1);
        this.factory2 = this.physics.add.image(200,540,"factory").setImmovable().setScale(0.5);
        this.player.displayHeight = 60;
        this.player.displayWidth = 60
        this.gdestroy = this.sound.add('gdestroy');

        this.score = 100;
        this.point = 0;
        this.activateBrahmos = false;
        this.scoreText = this.add.text(30,10, 'Ozone Level : 100', {fontSize : '18px', fill : '#fff'});
        this.pointText = this.add.text(30,50, 'points : ' + this.point, {fontSize : '18px', fill : '#fff'});

        
        //==============================create tile===============================
        const map = this.make.tilemap({key : 'map'});
        const tileset = map.addTilesetImage('ozone2','tiles');
        const worldLayer = map.createLayer('world', tileset,-390,-205);


        worldLayer.setCollisionByProperty({ collide : true });
        this.physics.add.collider(this.player,worldLayer);
        this.physics.add.collider(this.player,this.factory);
        this.physics.add.collider(this.player,this.factory2);
        // this.cameras.main.startFollow(this.player, true, 0.8, 0.8);
        this.cursor = this.input.keyboard.createCursorKeys();
        this.input.on('pointerdown', this.shoot, this);
        this.gas = this.physics.add.image(this.factory.x, this.factory.y, 'gas').setScale(0.1).setOrigin(0, 0.5);
        this.gas1=this.physics.add.image(this.factory2.x, this.factory2.y, 'gas').setScale(0.1).setOrigin(0, 0.5);
        SceneMain.setObjectVelocity(this.gas);
        SceneMain.setObjectVelocity(this.gas1);
       
    }
    shoot()
    {
        this.laser = this.physics.add.image(this.player.x, this.player.y, 'laser').setScale(0.2).setOrigin(0, 0.5);

        this.physics.moveTo(this.laser, this.game.input.mousePointer.x, this.game.input.mousePointer.y, 600);
        this.physics.add.collider(this.laser, this.gas, this.destroyGas, null, this);
        this.physics.add.collider(this.laser, this.gas1, this.destroyGas1, null, this);
        this.physics.add.collider(this.laser, this.factory, this.destroyLaser, null, this);
        this.physics.add.collider(this.laser, this.factory2, this.destroyLaser, null, this);

        if(this.point == 200 && this.activateBrahmos == false){
            this.activateBrahmos = true;   
        }
        // this.ammo.setVelocityY(-300);
    }
    destroyLaser(laser, factory) {
        laser.disableBody(true, true);
    }

    destroyGas(laser, gas) {
        this.gdestroy.play();
        gas.disableBody(true, true);
        laser.disableBody(true, true);  
        this.point += 100;
        this.pointText.setText('points : '+this.point);
        gas.enableBody(true, this.factory.x, this.factory.y, true, true);
        SceneMain.setObjectVelocity(gas);
    }
    destroyGas1(laser, gas) {
        this.gdestroy.play();
        gas.disableBody(true, true);
        laser.disableBody(true, true);
        this.point += 100;
        this.pointText.setText('points : ' + this.point);
        gas.enableBody(true, this.factory2.x, this.factory2.y, true, true);
        SceneMain.setObjectVelocity(gas);
    }
    update = function() {
        // ===================================movement of player==========================
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        
        
        if(this.cursor.right.isDown == true){
            this.player.setVelocityX(500);
        }

        if(this.cursor.left.isDown == true){
            this.player.setVelocityX(-500);
        }
        this.checkRepositionForObject(this.gas, this.score, this.scoreText);
        this.checkRepositionForObject1(this.gas1, this.score, this.scoreText);
        
    }
    
    

     // give random velocity to the group object
     static setObjectsVelocity(objects) {
         objects.children.iterate((objcet) => {
             SceneMain.setObjectVelocity(objcet);
         });
     }

     // give random velocity to singal object
     static setObjectVelocity(object) {
        const xVel = Phaser.Math.Between(-100, 100);
        const yVel = Phaser.Math.Between(-150, -200);
        object.setVelocity(xVel, yVel);
    }

   checkRepositionForObject(object,score,scoreText) {
        if(object.y < 0) {
            this.score -= 10;
            if(this.score == 70){
                this.ozone.y -= 50;
            }
            if(this.score == 40){
                this.ozone.y -= 50;
            }

            if(this.score <= 0){
                this.scene.start('gameOver', {point : this.point});
            }
            scoreText.setText('Ozone Level : '+this.score);
            object.y = this.factory.y;
            object.x = this.factory.x;
        }
    }
    checkRepositionForObject1(object, score, scoreText) {
        if (object.y < 0) {
            this.score -= 10;
            if (this.score == 70) {
                this.ozone.y -= 50;
            }
            if (this.score == 40) {
                this.ozone.y -= 50;
            }
            if(this.score <= 0){
                this.scene.start('gameOver', {point : this.point});
            }
            scoreText.setText('Ozone Level : ' + this.score);
            object.y = this.factory2.y;
            object.x = this.factory2.x;
        }
    }

    // reset position of the object
     
}

