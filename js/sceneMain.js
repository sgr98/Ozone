class SceneMain extends Phaser.Scene{
    constructor(){
        super(); 
    }

    preload = function() {
        this.load.image("player",'../assets/image/player.png');
        this.load.image("tiles",'../assets/image/ozone.png');
        this.load.image("laser",'../assets/image/laser.png');  
        this.load.image("factory", '../assets/image/factory.png');
        this.load.image("gas", '../assets/image/gases.png');
        this.load.tilemapTiledJSON('map', '../assets/maps/ozoneMap2.json');
    }
    
    create = function() {
        //=============================add player==============================
        this.player = this.physics.add.image(200,566,"player");
        this.factory = this.physics.add.image(1000,480,"factory").setImmovable();;
        this.player.displayHeight = 60;
        this.player.displayWidth = 60
         
        
        //==============================create tile===============================
        const map = this.make.tilemap({key : 'map'});
        const tileset = map.addTilesetImage('ozone2','tiles');
        const worldLayer = map.createLayer('world', tileset,-390,-205);


        worldLayer.setCollisionByProperty({ collide : true });
        this.physics.add.collider(this.player,worldLayer);
        this.physics.add.collider(this.player,this.factory);
        // this.cameras.main.startFollow(this.player, true, 0.8, 0.8);
        this.cursor = this.input.keyboard.createCursorKeys();
        this.input.on('pointerdown', this.shoot, this);
        this.gas = this.physics.add.image(this.factory.x, this.factory.y, 'gas').setScale(0.2).setOrigin(0, 0.5);
        // this.gas.setVelocityY(-200);
        //  this.gases = this.physics.add.group({
        //      key: 'gas',
        //      repeat: 3,
        //      setXY: {
        //          x: 20,
        //          y: 50,
        //          stepX: Phaser.Math.Between(10, 400 - 15),
        //          stepY: Phaser.Math.Between(15, 100),
        //      },
        //  });
        SceneMain.setObjectVelocity(this.gas);
       
    }
    shoot()
    {
        this.laser = this.physics.add.image(this.player.x, this.player.y, 'laser').setScale(0.2).setOrigin(0, 0.5);

        this.physics.moveTo(this.laser, this.game.input.mousePointer.x, this.game.input.mousePointer.y, 600);
        this.physics.add.collider(this.laser, this.gas, this.destroyGas, null, this);

        // this.ammo.setVelocityY(-300);
    }
    destroyGas()
    {
        console.log("destroy");
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
        this.checkRepositionForObject(this.gas);

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
   checkRepositionForObject(object) {
         
       if (object.y < 0) {
            console.log("reposition");
            object.y = this.factory.y;
           object.x = this.factory.x;
           
        }

     }

     // reset position of the object
     
}
