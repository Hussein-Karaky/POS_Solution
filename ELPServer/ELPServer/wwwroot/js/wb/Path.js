function Path(r, g, b, a, lw, name, cap){
	ComplexShape.call(this, 0, 0, 0, 0, cap, name, Point);
	this.closed = false;
	this.color = {R:r, G:g, B:b, A:a};
	this.lineWidth = lw;
};
Path.prototype = Object.create(ComplexShape.prototype);
Object.defineProperty(Path.prototype, 'constructor', { 
    value: Path, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
Path.prototype.setClosed = function(c) {
	this.closed = c;
};

Path.prototype.setColor = function(r, g, b, a, skipUndo) {
	if(skipUndo != true)
	app.undoList.push("find('" + this.id + "').setColor(" + this.color.R + ', ' + this.color.G + ', ' + this.color.B + ', ' + this.color.A + ")");
	this.color.R = r;
	this.color.G = g;
	this.color.B = b;
	this.color.A = a;
};

Path.prototype.setLineWidth = function(lw, skipUndo) {
	if(skipUndo != true)
	app.undoList.push("find('" + this.id + "').setLineWidth(" + this.lineWidth + ")");
	this.lineWidth = lw;
};

Path.prototype.drawDetails = function(pen) {
	if(this.children.length > 0){
		pen.beginPath();
		pen.moveTo(this.children[0].x, this.children[0].y);
		this.children.forEach(child => pen.lineTo(child.x, child.y));
		if(this.closed){
			pen.closePath();
		}

		// the outline
		pen.strokeStyle = 'rgba(' + this.color.R + ', ' + this.color.G + ', ' + this.color.B + ', ' + this.color.A + ')';//'#666666';
		pen.lineWidth = this.lineWidth;
		pen.stroke();

		// the fill color
		//pen.fillStyle = "#FFCC00";
		//pen.fill();
	}
};

Path.prototype.mouseMove = function(pointer){
	return this.parent;
};

function Line(r, g, b, a, lw, name){
	Path.call(this, r, g, b, a, lw, name, 2);
};
Line.prototype = Object.create(Path.prototype);
Object.defineProperty(Line.prototype, 'constructor', { 
    value: Line, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
Line.prototype.draw = function(pen) {
	if(this.children.length > 0){
		pen.beginPath();
		pen.moveTo(this.children[0].x, this.children[0].y);
		pen.lineTo(this.children[1].x, this.children[1].y);
		pen.closePath();

		// the outline
		pen.strokeStyle = 'rgba(' + this.color.R + ', ' + this.color.G + ', ' + this.color.B + ', ' + this.color.A + ')';//'#666666';
		pen.stroke();
	}
};

Line.prototype.mouseMove = function(pointer){
	return this.parent;
};
