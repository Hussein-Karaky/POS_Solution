function InteractionProvider(){

};
Object.defineProperty(InteractionProvider.prototype, 'constructor', { 
    value: InteractionProvider, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
	
InteractionProvider.prototype.adapt = function(e){
	return {x:e.offsetX, y:e.offsetY};
};

function TouchScreen(){
	InteractionProvider.call(this);
};
TouchScreen.prototype = Object.create(InteractionProvider.prototype);
Object.defineProperty(TouchScreen.prototype, 'constructor', { 
    value: TouchScreen, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
	
TouchScreen.prototype.adapt = function(e){
	return {x:(e.targetTouches[0].pageX - app.canvas.offsetLeft), y:(e.targetTouches[0].pageY - app.canvas.offsetTop)};
};

function Mouse(){
	InteractionProvider.call(this);
};
Mouse.prototype = Object.create(InteractionProvider.prototype);
Object.defineProperty(Mouse.prototype, 'constructor', { 
    value: Mouse, 
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
	
Mouse.prototype.adapt = function(e){
	return {x:(e.offsetX || e.layerX - app.canvas.offsetLeft), y:(e.offsetY || e.layerY - app.canvas.offsetTop)};
};
