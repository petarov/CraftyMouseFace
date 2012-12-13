/**
 * CraftyMouseFace - 2D Shooter / Demo #1
 * 
 * Url: https://github.com/petarov/CraftyMouseFace
 * Sprites & Tiles: http://art.devsader.com/browse
 */

$(document).ready(function() {
        
    // Init Crafty Engine
    Crafty.init(832, 512, 60).canvas.init();
    Crafty.background('#000');
    
    // Change this to "DOM" if rendering is slow
    var render = "Canvas";
    
    // Load assets
    Crafty.scene("load", function() {
        Crafty.load([
            "assets/InsideTiles_Moosader.png", 
            "assets/RunningDood_Moosader.png",
            ], 
        function() {
        	// load gfx
    	    Crafty.sprite(64, "assets/InsideTiles_Moosader.png", {
			    wall: [1,1],
			    floor1: [0,2],
			    floor2: [1,2],
		    });
            Crafty.sprite("assets/RunningDood_Moosader.png", {
			    player: [0, 0, 80, 30],
		    });
            
            $('#loading').hide();
            Crafty.scene('game');
        },
        // On Progress
        function(e) {
            $('#loading').html('Loaded: ' + e.percent.toFixed(0) + '%');
        },
        // On Error
        function(e) {
            $('#loading').html('Could not load: ' + e.src);
        });
    });
    
    // main scene
    Crafty.scene("game", function() {
    	var zbase = 2;
    	// draw tile floor
    	for(var i = 0; i < 13; i++) {
    		for(var j = 0; j < 8; j++) {
    			Crafty.e("2D, " + render + ", floor2")
    			.attr({x: i * 64, y: j * 64, z: zbase});
    		}
    	}
    	// character animation 
    	Crafty.c('CharAnims', {
    		CharAnims: function() {
    	        // setup animations sequences
    	        this.requires("SpriteAnimation, Grid")
    	        .animate("walk", [ [0, 90], [0, 60], [0, 30], [0, 0] ]);
    	        return this;
    	    }
    	});    	
    	// create character
    	var entity = Crafty.e("2D, " + render + ", player, CharAnims, Multiway, MouseFace")
        .attr({
            move: {left: false, right: false, up: false, down: false},
            x: 400, y: 256, z: zbase + 1,
            moving: false
        })
        .origin('center')  // rotate origin
        .MouseFace({x: 40, y: 15})
        .CharAnims()
    	.bind("Moved", function(from) {
    		this.moving = true;
    	})
    	.bind("EnterFrame", function() {
    		// If moving, adjust the proper animation and facing
    		if (this.moving) {
            	if (!this.isPlaying('walk'))
            		this.stop().animate('walk', 8, -1); 
	            this.moving = false;
    		} else {
    			this.stop();
    		} 
    	})
    	.multiway(2, {W: -90, S: 90, D: 0, A: 180})
    	.bind("MouseMoved", function(e) {
    		console.log(this.getAngle(true));
    		// adjust player sprite facing
    		// we add +90, since initially player is facing pi/2
    		this.rotation = (this.getAngle(true) % 360) + 90;
    		console.log(this.rotation);
    	})
    	.bind("MouseLeftUp", function(data) {
    		// shoot - create bullet
        	Crafty.e("2D, " + render + ", Color")
            .attr({
                x: this.x + 40, y: this.y + 15, z: zbase + 1,
                w: 3, h: 3,
                speed: 5,
                angle: this.getAngle()
            })
            .color("#FA5656")
            .bind("EnterFrame", function(frame) {
            	this.x += Math.cos(this.angle) * this.speed;
            	this.y += Math.sin(this.angle) * this.speed;
            	
            	if (this.x > Crafty.viewport.width || this.x < 0) {
            		this.destroy();
            	}
            });
    	});
    });
    // start
    Crafty.scene('load');
});