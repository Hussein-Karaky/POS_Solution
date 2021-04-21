function Shape(x, y, w, h, name){
	Drawable.call(this, x, y, name);
	this.width = w;
	this.height = h;
	this.background = Background.prototype.None;
	this.border = Border.prototype.None;	
};
Shape.prototype = Object.create(Drawable.prototype);
Object.defineProperty(Shape.prototype, 'constructor', { 
    value: Shape, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
	
Shape.prototype.setWidth = function(width, skipUndo){
	if(this.width == width){
		return;
	}
	if(skipUndo != true)
	app.undoList.push("find('" + this.id + "').setWidth(" + this.width + ")");
	this.width = width;
};

Shape.prototype.setHeight = function(height, skipUndo){
	if(this.height == height){
		return;
	}
	if(skipUndo != true)
	app.undoList.push("find('" + this.id + "').setHeight(" + this.height + ")");
	this.height = height;
};

Shape.prototype.setSize = function(w, h, skipUndo){
	if(this.width == w && this.height == h){
		return;
	}
	if(skipUndo != true)
	app.undoList.push("find('" + this.id + "').setSize(" + this.width + ', ' + this.height + ")");
	this.width = w;
	this.height = h;
};

Shape.prototype.setBorder = function(border, skipUndo) {
	if(skipUndo != true)
	app.undoList.push("find('" + this.id + "').setBorder(" + this.border + ")");
	this.border = border;
};

Shape.prototype.setBackground = function(background){
	this.background = background;
};

Shape.prototype.draw = function(pen){
	this.background.draw(pen, this);
	this.drawDetails(pen);
	this.border.draw(pen, this);
/*
	pen.beginPath();
	var centerX = this.X;
	var centerY = this.Y;
	for (var i = 1.65 * Math.PI; i < 1.92 * Math.PI; i += 0.01 ) {
		xPos = centerX - (90 * Math.sin(i)) * Math.sin(1.16 * Math.PI) + (90 * Math.cos(i)) * Math.cos(1.16 * Math.PI);
		yPos = centerY + (90 * Math.cos(i)) * Math.sin(1.16 * Math.PI) + (90 * Math.sin(i)) * Math.cos(1.16 * Math.PI);

		if (i == 0) {
			pen.moveTo(xPos, yPos);
		} else {
			pen.lineTo(xPos, yPos);
		}
	}
	pen.lineWidth = 2;
	pen.strokeStyle = "#232323";
	pen.stroke();
	pen.closePath();
	*/
};

Shape.prototype.drawDetails = function(pen){};
	
