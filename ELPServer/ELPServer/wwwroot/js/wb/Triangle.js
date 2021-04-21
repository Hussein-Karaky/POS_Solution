function Triangle(x, y, name){
	Path.call(this, x, y, name);
};
Triangle.prototype = Object.create(Path.prototype);
Object.defineProperty(Triangle.prototype, 'constructor', { 
    value: Point, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
Triangle.prototype.draw = function(pen) {
	pen.beginPath();
	pen.moveTo(100, 70);
	pen.lineTo(80, 140);
	pen.lineTo(200, 120);
	pen.closePath();

	// the outline
	pen.lineWidth = 10;
	pen.strokeStyle = '#666666';
	pen.stroke();

	// the fill color
	pen.fillStyle = "#FFCC00";
	pen.fill();
};
