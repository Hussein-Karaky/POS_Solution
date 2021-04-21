function Rectangle(x, y, w, h, name){
	Shape.call(this, x, y, w, h, name);
};
Rectangle.prototype = Object.create(Shape.prototype);
Object.defineProperty(Rectangle.prototype, 'constructor', { 
    value: Rectangle, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
Rectangle.prototype.drawDetails = function(pen){
	Shape.prototype.drawDetails.call(this, pen);
};
