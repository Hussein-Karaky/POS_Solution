function Point(x, y, name){
	Shape.call(this, x, y, name);
	this.color = {R:0, G:0, B:0, A:1};
	this.connected = false;
};

Point.prototype = Object.create(Shape.prototype);
Object.defineProperty(Point.prototype, 'constructor', { 
    value: Point, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
	
Point.prototype.setColor = function(r, g, b, a) {
	this.color.R = r;
	this.color.G = g;
	this.color.B = b;
	this.color.A = a;
};

Point.prototype.draw = function(pen) {
	pen.beginPath();
	pen.strokeStyle = 'rgba(' + this.color.R + ', ' + this.color.G + ', ' + this.color.B + ', ' + this.color.A + ')';//'#666666';
	pen.arc(this.x, this.y, 1, 0, 2 * Math.PI);
	pen.stroke();
};

