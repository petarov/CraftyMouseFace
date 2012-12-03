/*
 * The MIT License
 * 
 * Copyright (c) 2012 Petar Petrov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
/**
 * Desc: Component that monitors mouse movement and calculates angular position relative to the position of the entity.
 * Url: https://github.com/petarov/CraftyMouseFace
 */
Crafty.c("MouseFace", {
    _dirAngle: 0, // simple type -> not shared
    
    _onmouseup: function (e) {
        if (this.disableControls || this.disregardMouseInput) {
            return;
        }
        if (e.mouseButton == Crafty.mouseButtons.LEFT) {
            this._mouseButtonLeft = this._mouseButtonState.up;
            this.trigger("MouseLeftUp", e);
        }
    },
    _onmousedown: function (e) {
        if (this.disableControls || this.disregardMouseInput) {
            return;
        }
        if (e.mouseButton == Crafty.mouseButtons.LEFT) {
            this._mouseButtonLeft = this._mouseButtonState.down;
            this.trigger("MouseLeftDown", e);
        }
    },
    _onmousemove: function (e) {
        if (this.disableControls || this.disregardMouseInput) {
            return;
        }
        
        this._pos.x = e.realX;
        this._pos.y = e.realY;        
        
        var dx = e.realX - this.x, 
            dy = e.realY - this.y;
            
        //_dirAngle = Math.asin(dy / Math.sqrt(dx * dx + dy * dy)) * 2 * Math.PI;
        this._dirAngle = Math.atan2(dy, dx);
        
        if (Crafty.math.withinRange(this._dirAngle, this._pi_4, this.pi_4)) { // RIGHT
            this._dirMove = this._directions.right;
        } else if (Crafty.math.withinRange(this._dirAngle, this.pi_4, this.pi_34)) { // DOWN
            this._dirMove = this._directions.down;
        } else if (Crafty.math.withinRange(this._dirAngle, this.pi_34, this.pi)) { // LEFT
            this._dirMove = this._directions.left;
        }
        
        if (Crafty.math.withinRange(this._dirAngle, this._pi, this._pi_34)) { // LEFT
            this._dirMove = this._directions.left;
        } else if (Crafty.math.withinRange(this._dirAngle, this._pi_34, this._pi_4)) { // UP
            this._dirMove = this._directions.up;
        } else if (Crafty.math.withinRange(this._dirAngle, this._pi_4, 0)) { // RIGHT
            this._dirMove = this._directions.right;
        }    
    },
    init: function () {
        this.requires("Mouse");
        
        this._pos = {x: 0, y: 0};
        
        // init radian angular measurements with respect to atan2 (arctangent) calculations
        // this would mean in the ranges of (0, -pi) and (0, pi).
        // This was helpful :P - http://en.wikipedia.org/wiki/File:Degree-Radian_Conversion.svg
        this.pi = Math.PI;
        this._pi = -1 * Math.PI;
        this.pi_4 = Math.PI / 4;
        this._pi_4 = -1 * this.pi_4;
        this.pi_34 = 3 * Math.PI / 4;
        this._pi_34 = -1 * this.pi_34;
        
        this._directions = {none: 0, left: -1, right: 1, up: -2, down: 2};
        this._dirMove = this._directions.none;
        this._mouseButtonState = {none: 0, up: 1, down: 2};
        this._mouseButtonLeft = this._mouseButtonState.none;
        this._mouseButtonRight = this._mouseButtonState.none;

        Crafty.addEvent(this, Crafty.stage.elem, "mousemove", this._onmousemove);
        Crafty.addEvent(this, Crafty.stage.elem, "mouseup", this._onmouseup);
        Crafty.addEvent(this, Crafty.stage.elem, "mousedown", this._onmousedown);
    },
    direction: function() {
    	return this._dirMove;
    }
}); 