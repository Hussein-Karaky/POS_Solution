function ComplexShape(x, y, w, h, capacity, name, childType){
	Shape.call(this, x, y, w, h, name);
	this.children = [];
	this.capacity = capacity;
	this.childType = childType;
};
ComplexShape.prototype = Object.create(Shape.prototype);
Object.defineProperty(ComplexShape.prototype, 'constructor', { 
    value: ComplexShape, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
	
//ComplexShape.prototype.draw = function(pen){
	//Shape.prototype.draw.call(this, pen);
//};

ComplexShape.prototype.drawDetails = function(pen){
	this.children.forEach(child => child.draw(pen));
};

ComplexShape.prototype.add = function(child, skipUndo){
	if(this.childType !== null && !(child instanceof this.childType)){
		return child;
	}
	if(!this.children.includes(child) && (this.children.length < this.capacity || this.capacity == -1)){
		this.children.push(child);
		child.setId(this.id.concat('.').concat(this.children.length - 1));
		child.setParent(this);
		if(skipUndo != true)
		app.undoList.push("find('" + this.id + "').removeAt(" + (this.children.length - 1) + ")");
	}
	return child;
};

ComplexShape.prototype.remove = function(child){
	return this.children.pop(child);
};

ComplexShape.prototype.removeAt = function(index){
	return this.children.splice(index, 1);
};

ComplexShape.prototype.setCapacity = function(capacity){
	return this.capacity = capacity;
};

ComplexShape.prototype.setChildType = function(childType){
	return this.childType = childType;
};

ComplexShape.prototype.getChildType = function(){
	return this.childType;
};

ComplexShape.prototype.clear = function(){
	this.children = null;
	this.children = [];
	this.draw(app.pen);
	return this;
};

ComplexShape.prototype.mouseDown = function(pointer){};

ComplexShape.prototype.mouseMove = function(pointer){
	for(i = 0; i < this.children.length; i++){
		if(this.children[i].touched(pointer)){
			return this.children[i].mouseMove(pointer);
		}
	}
	return this;
};

ComplexShape.prototype.mouseUp = function(pointer){};


