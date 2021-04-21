function Painter(icon, desc){
this.icon = icon;
this.description = desc;
this.target = null;//parent id as string
};
Painter.prototype.produce = function(){};
Painter.prototype.produceControl = function(){};
Painter.prototype.finalize = function(){};
Painter.prototype.mouseDown = function(pointer){};
Painter.prototype.mouseMove = function(pointer){};
Painter.prototype.mouseUp = function(pointer){};
Painter.prototype.setIcon = function(icon){
	this.icon = icon;
};

Painter.prototype.setDescription = function(desc){
	this.description = desc;
};

Painter.prototype.setTarget = function(target){
	this.target = target;
};

function PathPainter(icon, desc){
	Painter.call(this, icon, desc);
};
PathPainter.prototype = Object.create(Painter.prototype);
Object.defineProperty(PathPainter.prototype, 'constructor', { 
    value: PathPainter, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
	
PathPainter.prototype.produce = function(){
	return app.target.add(new Path(0, 0, 2, 2, null));
};

PathPainter.prototype.produceControl = function(){};

PathPainter.prototype.finalize = function(){};

PathPainter.prototype.mouseDown = function(pointer){
	let path = new Path(210, 120, 250, 0.5, 3, null, -1);//x, y, 0, 0, null);
	//path.setBorder(new RectBorder(210, 120, 250, 0.5, Aspect.prototype.Solid, 3));
	app.curDrawable = app.target.add(path);
    app.curDrawable.add(new Point(pointer.x, pointer.y));
};

PathPainter.prototype.mouseMove = function(pointer){
	app.curDrawable.add(new Point(pointer.x, pointer.y, null));
	if(app.curDrawable.x > pointer.x){
		app.curDrawable.x = pointer.x;
	}
	if(app.curDrawable.y > pointer.y){
		app.curDrawable.y = pointer.y;
	}
	if(app.curDrawable.width < pointer.x - app.curDrawable.x){
		app.curDrawable.width = pointer.x - app.curDrawable.x;
	}
	if(app.curDrawable.height < pointer.y - app.curDrawable.y){
		app.curDrawable.height = pointer.y - app.curDrawable.y;
	}
};

PathPainter.prototype.mouseUp = function(pointer){
	
};
//Rect
function RectPainter(icon, desc){
	Painter.call(this, icon, desc);
	this.start = {x:0, y:0};
};
RectPainter.prototype = Object.create(Painter.prototype);
Object.defineProperty(RectPainter.prototype, 'constructor', { 
    value: RectPainter, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
	
RectPainter.prototype.produce = function(){
	return app.target.add(new Rectangle(0, 0, 2, 2, null));

};

RectPainter.prototype.produceControl = function(){};

RectPainter.prototype.finalize = function(){};

RectPainter.prototype.mouseDown = function(pointer){
	let rect = new Rectangle(pointer.x, pointer.y, 2, 2, null);
	this.start.x = pointer.x;
	this.start.y = pointer.y;
	rect.setBorder(new RectBorder(21, 230, 220, 0.5, Aspect.prototype.Solid, 2), true);
	app.curDrawable = app.target.add(rect);
};

RectPainter.prototype.mouseMove = function(pointer){
	app.curDrawable.setSize(Math.abs(pointer.x - this.start.x), Math.abs(pointer.y - this.start.y), true);
	app.curDrawable.setX(pointer.x < this.start.x ? pointer.x : this.start.x, true);
	app.curDrawable.setY(pointer.y < this.start.y ? pointer.y : this.start.y, true);
};

RectPainter.prototype.mouseUp = function(pointer){
	
};
//Triangle
function TrianglePainter(icon, desc){
	Painter.call(this, icon, desc);
	this.start = {x: 0, y: 0};
};
TrianglePainter.prototype = Object.create(Painter.prototype);
Object.defineProperty(TrianglePainter.prototype, 'constructor', { 
    value: TrianglePainter, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
	
TrianglePainter.prototype.produce = function(){
	return app.target.add(new Triangle(0, 0, 2, 2, null));

};

TrianglePainter.prototype.produceControl = function(){};

TrianglePainter.prototype.finalize = function(){};

TrianglePainter.prototype.mouseDown = function(pointer){
	let rect = new Triangle(pointer.x, pointer.y, 2, 2, null);
	this.start.x = pointer.x;
	this.start.y = pointer.y;
	rect.setBackground(new RectSolidBackground());
	rect.setBorder(new RectBorder(21, 230, 220, 0.5, Aspect.prototype.Solid, 2));
	app.curDrawable = app.target.add(rect);
};

TrianglePainter.prototype.mouseMove = function(pointer){
	app.curDrawable.setSize(Math.abs(pointer.x - this.start.x), Math.abs(pointer.y - this.start.y), true);
	app.curDrawable.setX(pointer.x < this.start.x ? pointer.x : this.start.x, true);
	app.curDrawable.setY(pointer.y < this.start.y ? pointer.y : this.start.y, true);
};

TrianglePainter.prototype.mouseUp = function(pointer){
	
};

//Arc
function ArcPainter(icon, desc){
	Painter.call(this, icon, desc);
	this.start = {x:0, y:0};
};
ArcPainter.prototype = Object.create(Painter.prototype);
Object.defineProperty(ArcPainter.prototype, 'constructor', { 
    value: ArcPainter, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
	
ArcPainter.prototype.produce = function(){
	return app.target.add(new Arc(0, 0, 2, 2, null));

};

ArcPainter.prototype.produceControl = function(){};

ArcPainter.prototype.finalize = function(){};

ArcPainter.prototype.mouseDown = function(pointer){
	let rect = new Arcangle(pointer.x, pointer.y, 2, 2, null);
	this.start.x = pointer.x;
	this.start.y = pointer.y;
	rect.setBorder(new RectBorder(21, 230, 220, 0.5, Aspect.prototype.Solid, 2));
	app.curDrawable = app.target.add(rect);
};

ArcPainter.prototype.mouseMove = function(pointer){
	app.curDrawable.setSize(Math.abs(pointer.x - this.start.x), Math.abs(pointer.y - this.start.y), true);
	app.curDrawable.setX(pointer.x < this.start.x ? pointer.x : this.start.x, true);
	app.curDrawable.setY(pointer.y < this.start.y ? pointer.y : this.start.y, true);
};

ArcPainter.prototype.mouseUp = function(pointer){
	
};

//Line
function LinePainter(icon, desc){
	Painter.call(this, icon, desc);
	this.start = {x:0, y:0};
};
LinePainter.prototype = Object.create(Painter.prototype);
Object.defineProperty(LinePainter.prototype, 'constructor', { 
    value: LinePainter, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
	
LinePainter.prototype.produce = function(){
	return app.target.add(new Line(210, 120, 250, 0.5, 3, null));
};

LinePainter.prototype.produceControl = function(){};

LinePainter.prototype.finalize = function(){};

LinePainter.prototype.mouseDown = function(pointer){
	let line = app.curDrawable = app.target.add(new Line(210, 120, 250, 0.5, 3, null));
    line.add(new Point(pointer.x, pointer.y), true);
    line.add(new Point(pointer.x, pointer.y), true);
};

LinePainter.prototype.mouseMove = function(pointer){
	app.curDrawable.children[1].setX(pointer.x, true);
	app.curDrawable.children[1].setY(pointer.y, true);
};

LinePainter.prototype.mouseUp = function(pointer){
	
};


