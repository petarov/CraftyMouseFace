CraftyMouseFace
===============

[Crafty](http://craftyjs.com/) component that monitors mouse movement and calculates angular position relative to entity position.

# Description

This component does the following:

  1. It finds the angle between given Sprite and mouse position and triggers a Crafty [event](http://craftyjs.com/api/Crafty-trigger.html) which holds information about current mouse position and calculated angle in radians and degrees.
  2. Determines sprite facing direction.
  3. Triggers Crafty [events](http://craftyjs.com/api/Crafty-trigger.html) when a mouse buttons is **pressed down** or **released up** anywhere on the game screen.

![alt text](http://i28.tinypic.com/2llj7e8.png "2D coordinates")

# How To Use

## Demos

Demos are located in the [demos](demos) folder. There are currently 2 demos:
  * [Demo1](demos/demo1.js): Move sprite around the screen and shoot. Sprite faces mouse cursor position when moving.
  * [Demo2](demos/demo2.js): Move sprite around the screen and shoot. Sprite rotates to face the mouse cursor.

To run the demos first install the required bower dependencies via:

    bower install

You may use Python3 to start an http web server on http://localhost:8000 and test the demos:

    python -m http.server
    Serving HTTP on 0.0.0.0 port 8000 ...

Demo2 is using a handy component called [CraftyEntityBoxOverlays](https://github.com/towbi/CraftyEntityBoxOverlays) to display entity collision and rotation boxes.

## Examples

Create 2D Sprite entity with the *MouseFace* component enabled.

```javascript
    var entity = Crafty.e("2D, DOM, player, CharAnims, Multiway, MouseFace")
    .attr({
        x: 400, y: 256, z: zbase + 1,
        moving: false
    })
```

Set a boolean flag when player is moving the sprite.

```javascript
    .CharAnims()
    .bind("Moved", function(from) {
        this.moving = true;
    })
```

Now, adjust the animation depending on the position of player's sprite relative to the mouse position.

```javascript
    .bind("EnterFrame", function() {
            // Display animation in the direction of moving
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
                this.animate(anim, -1); 
            }    
            
            this.moving = false;
        } else {
            this.pauseAnimation();
        } 
    })
      
```

Spawn a bullet when left mouse button is released. We're using the **getAngle()** call which will fetch the already calculated direction angle. We can then use the direction angle to adjust the vector of entity movement.

```javascript
    .bind("MouseUp", function(data) {
        if (data.mouseButton == Crafty.mouseButtons.LEFT) {
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
        }
    });
```

For more examples please check the [demos](demos/) folder.
