function GeoPinPoint(x, y, name){
	Point.call(this, x, y, name);
	this.connected = false;
};

GeoPinPoint.prototype = Object.create(Point.prototype);
Object.defineProperty(GeoPinPoint.prototype, 'constructor', { 
    value: GeoPinPoint, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });

GeoPinPoint.prototype.connectTo = function(point) {
	if(point.accepts(this)){
		this.X = point.X;
		this.Y = point.Y;
		this.connected = true;
		if(parent != null){
			parent.checkCon();
		}
	}
};

GeoPinPoint.prototype.disconnect = function() {
	if(point.rejects(this)){
		this.connected = false;
		if(parent != null){
			parent.checkCon();
		}
	}
};