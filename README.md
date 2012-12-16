CraftyMouseFace
===============

Component that monitors mouse movement and calculates angular position relative to the position of the entity.

# What does this component do ?

This component does the following:

  1. Finds the angle between given Sprite and mouse position on the Canvas and triggers **Crafty event** which holds 
information about current mouse position and calculated angle in radians and degrees.
  2. Determines sprite facing direction.
  3. Triggers **Crafty events** when mouse buttons are **pressed down** or **released up** somewhere on the Canvas.

![alt text](http://i28.tinypic.com/2llj7e8.png "2D coordinates")

# Usage

## Demos

Demos are located in [Demos](https://github.com/petarov/CraftyMouseFace/tree/master/demos) folder. There are two demos:
  * Move sprite around the screen and shoot. Sprite animation is facing mouse position.
  * Move sprite around the screen and shoot. Rotate sprite to face mouse position.

Second demos is using a handy component called [CraftyEntityBoxOverlays](https://github.com/towbi/CraftyEntityBoxOverlays) to display entity collision and rotation boxes.

## Sample

Create 2D Sprite entity with *MouseFace* component enabled.

```javascript
    	var entity = Crafty.e("2D, DOM, player, CharAnims, Multiway, MouseFace")
        .attr({
            x: 400, y: 256, z: zbase + 1,
            moving: false
        })
```

Set bool flag if user is currently moving the sprite.

```javascript
      .CharAnims()
    	.bind("Moved", function(from) {
    		this.moving = true;
    	})
```

Now, adjust the animation depending on the position of the mouse relative to the player's sprite position.

```javascript
    	.bind("EnterFrame", function() {
    		// If moving, adjust the proper animation and facing
    		if (this.moving) {
	    		var anim = null;
	    		switch(this.getDirection()) {
	    		case this._directions.left:
	    			anim = 'walk_left';
	    			break;
	    		case this._directions.right:
	    			anim = 'walk_right';
	    			break;
	    		case this._directions.up:
	    			anim = 'walk_up';
	    			break;
	    		case this._directions.down:
	    			anim = 'walk_down';
	    			break;    			
	    		}
	    		
           if (anim) {
            	if (!this.isPlaying(anim))
            		this.stop().animate(anim, 8, -1); 
        	}
	            
	            this.moving = false;
    		} else {
    			this.stop();
    		} 
    	})
      
```

Spawn a bullet when left mouse button is released. We're using the **getAngle()** call which will fetch the already calculated direction angle.
We can then use the direction angle to adjust the vector of entity movement.

```javascript
    	.bind("MouseLeftUp", function(data) {
    		// shoot - create bullet
        	Crafty.e("2D, DOM, Color")
            .attr({
                x: this.x + 16, y: this.y + 24, z: zbase + 1,
                w: 3, h: 3,
                speed: 5,
                angle: this.getAngle()
            })
            .color("#FA5656")
            .bind("EnterFrame", function(frame) {
            	this.x += Math.cos(this.angle) * this.speed;
            	this.y += Math.sin(this.angle) * this.speed;
              // destroy ...
            });
    	});
    });
```

For more examples please check the **demos/** folder.
