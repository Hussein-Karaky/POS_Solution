function WhiteBoard(x, y, w, h, name){
	ComplexShape.call(this, x, y, w, h, -1, name, Drawable);
};
WhiteBoard.prototype = Object.create(ComplexShape.prototype);
Object.defineProperty(WhiteBoard.prototype, 'constructor', { 
    value: WhiteBoard, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
WhiteBoard.prototype.draw = function(pen){
	ComplexShape.prototype.draw.call(this, pen);
};
