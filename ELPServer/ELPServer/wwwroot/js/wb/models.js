function Drawable(x, y, name){
	this.x = x;
	this.y = y;
	this.name = name;
	this.parent = null;
	this.id = null;
};
Drawable.prototype.draw = function(pen){}
Drawable.prototype.None = new None();
Drawable.prototype.setId = function(id){
	this.id = id;
};
Drawable.prototype.setX = function(x, skipUndo){
	if(this.x == x){
		return;
	}
	if(skipUndo != true)
	app.undoList.push("find('" + this.id + "').setX(" + this.x + ")");
	this.x = x;
};

Drawable.prototype.setY = function(y, skipUndo){
	if(this.y == y){
		return;
	}
	if(skipUndo != true)
	app.undoList.push("find('" + this.id + "').setY(" + this.y + ")");
	this.y = y;
};

Drawable.prototype.setLocation = function(x, y, skipUndo){
	if(this.x == x && this.y == y){
		return;
	}
	if(skipUndo != true)
	app.undoList.push("find('" + this.id + "').setLocation(" + this.x + ', ' + this.y + ")");
	this.x = x;
	this.y = y;
};

Drawable.prototype.setName = function(name){
	this.name = name;
};

Drawable.prototype.setParent = function(parent){
	this.parent = parent;
};

Drawable.prototype.touched = function(pointer){
	return pointer.x >= this.x && pointer.x <= (this.x + this.width) && pointer.y >= this.y && pointer.y <= (this.y + this.height);
};

Drawable.prototype.mouseDown = function(pointer){};

Drawable.prototype.mouseMove = function(pointer){
	return this.parent;
};

Drawable.prototype.mouseUp = function(pointer){};

function None(){
	Drawable.call(this, 0, 0, null);
};
None.prototype = Object.create(Drawable.prototype);
Object.defineProperty(None.prototype, 'constructor', { 
    value: None, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
None.prototype.draw = function(pen){}

function Aspect(pattern){
	this.pattern = pattern instanceof Array ? pattern : [];
};
Object.defineProperty(Aspect.prototype, 'constructor', { 
    value: Aspect, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
Aspect.prototype.apply = function(pen){
	pen.setLineDash(this.pattern);
};
Aspect.prototype.Solid = new Aspect([]);

function DashedAspect(){
	Aspect.call(this, [4, 4]);
};
DashedAspect.prototype = Object.create(Aspect.prototype);
Object.defineProperty(Aspect.prototype, 'constructor', { 
    value: DashedAspect, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });

function Border(r, g, b, a, aspect, width){
	this.color = {R:(255 -r) >= 0 ? r : 0, G:(255 -g) >= 0 ? g : 0, B:(255 -b) >= 0 ? b : 0, A:(1 -a) >= 0 ? a : 0};
	this.aspect = aspect instanceof Aspect ? aspect : Aspect.prototype.Solid;
	this.width = width > 0 ? width : 3;
};
Object.defineProperty(Border.prototype, 'constructor', { 
    value: Border, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
Border.prototype.draw = function(pen, shape){
	pen.lineWidth = this.width;
	pen.strokeStyle = "rgba(".concat(this.color.R).concat(',').concat(this.color.G).concat(',').concat(this.color.B).concat(',').concat(this.color.A).concat(')');
	this.aspect.apply(pen);
};
Border.prototype.None = new Border();
Border.prototype.setAspect = function(aspect){
	this.aspect = aspect;
};

function RectBorder(r, g, b, a, aspect, width){
	Border.call(this, r, g, b ,a, aspect, width);
};
RectBorder.prototype = Object.create(Border.prototype);

Object.defineProperty(RectBorder.prototype, 'constructor', { 
    value: RectBorder, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
RectBorder.prototype.draw = function(pen, rectangle){
	Border.prototype.draw.call(this, pen, rectangle);
	pen.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
};

function Background(){
};
Background.prototype.Types = ["solid", "image", "pattern"];
Background.prototype.Type = { solid:0, image:1, pattern:2};
Object.defineProperty(Background.prototype, 'constructor', { 
    value: Background, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
Background.prototype.draw = function(pen, shape){}
Background.prototype.None = new Background();

function SolidBackground(r, g, b, a){
	this.color = {R:r, G:g, B:b, A:a};
};
SolidBackground.prototype = Object.create(Background.prototype);
Object.defineProperty(SolidBackground.prototype, 'constructor', { 
    value: SolidBackground, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
SolidBackground.prototype.draw = function(pen, shape){}

function PathSolidBackground(r, g, b, a){
	this.color = {R:r, G:g, B:b, A:a};
};
PathSolidBackground.prototype = Object.create(SolidBackground.prototype);
Object.defineProperty(PathSolidBackground.prototype, 'constructor', { 
    value: PathSolidBackground, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
PathSolidBackground.prototype.draw = function(pen, rectangle){
	pen.fillStyle = 'rgba(' + this.color.R + ', ' + this.color.G + ', ' + this.color.B + ', ' + this.color.A + ')';
	pen.fill();
}

function RectSolidBackground(r, g, b, a){
	this.color = {R:r, G:g, B:b, A:a};
};
RectSolidBackground.prototype = Object.create(SolidBackground.prototype);
Object.defineProperty(RectSolidBackground.prototype, 'constructor', { 
    value: RectSolidBackground, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
RectSolidBackground.prototype.draw = function(pen, rectangle){
	pen.fillStyle = 'rgba(' + this.color.R + ', ' + this.color.G + ', ' + this.color.B + ', ' + this.color.A + ')';
	pen.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
}

function TriangleSolidBackground(r, g, b, a){
	this.color = {R:r, G:g, B:b, A:a};
};
TriangleSolidBackground.prototype = Object.create(SolidBackground.prototype);
Object.defineProperty(TriangleSolidBackground.prototype, 'constructor', { 
    value: TriangleSolidBackground, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
TriangleSolidBackground.prototype.draw = function(pen, triangle){
	pen.fillStyle = 'rgba(' + this.color.R + ', ' + this.color.G + ', ' + this.color.B + ', ' + this.color.A + ')';
	pen.fill();
}

function ArcSolidBackground(r, g, b, a){
	this.color = {R:r, G:g, B:b, A:a};
};
ArcSolidBackground.prototype = Object.create(SolidBackground.prototype);
Object.defineProperty(ArcSolidBackground.prototype, 'constructor', { 
    value: ArcSolidBackground, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
ArcSolidBackground.prototype.draw = function(pen, arc){
	pen.fillStyle = 'rgba(' + this.color.R + ', ' + this.color.G + ', ' + this.color.B + ', ' + this.color.A + ')';
	pen.fill();
}

