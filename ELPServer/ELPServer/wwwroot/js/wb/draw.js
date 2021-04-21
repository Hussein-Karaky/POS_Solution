var app = {
	isDrawing: false,
	isMoving: false,
	x: 0,
	y: 0,
	pen: null,
	canvas: null,
	whiteBoard: new WhiteBoard(0, 0, 650, 300, null),
	curDrawable: null,
	target: null,
	undoList: [],
	curPainter: new PathPainter(),//RectPainter()
	interactProvider: new InteractionProvider(),
	pointer: {x: 0, y: 0}
};
app.whiteBoard.setId('0');
app.whiteBoard.setBackground(new RectSolidBackground(255, 255, 255, 1.0));

let pointerBuf = {x: 0, y: 0};
$(document).ready(function(){
 app.canvas = document.getElementById("whiteBoard");//$('#app.whiteBoard');
 app.pen = app.canvas.getContext('2d');
 app.pen.lineCap = app.pen.lineJoin = 'round';
 
 resizeCanvas();

	if (app.pen != null) {
	  // drawing code here
			app.pen.fillStyle = 'rgb(200, 0, 0)';
			app.pen.fillRect(100, 100, 50, 50);

			app.pen.fillStyle = 'rgba(0, 0, 200, 0.5)';
			app.pen.fillRect(30, 30, 50, 50);
	} else {
	  // app.canvas-unsupported code here
	}
	
// Add the event listeners for mousedown, mousemove, and mouseup
	let isTouchSupported = 'ontouchstart' in window;
	let isPointerSupported = navigator.pointerEnabled;
	let isMSPointerSupported =  navigator.msPointerEnabled;
	
	let downEvent = isTouchSupported ? 'touchstart' : (isPointerSupported ? 'pointerdown' : (isMSPointerSupported ? 'MSPointerDown' : 'mousedown'));
	let moveEvent = isTouchSupported ? 'touchmove' : (isPointerSupported ? 'pointermove' : (isMSPointerSupported ? 'MSPointerMove' : 'mousemove'));
	let upEvent = isTouchSupported ? 'touchend' : (isPointerSupported ? 'pointerup' : (isMSPointerSupported ? 'MSPointerUp' : 'mouseup'));

	app.canvas.addEventListener(downEvent, startDraw, false);
	app.canvas.addEventListener(moveEvent, draw, false);
	app.canvas.addEventListener(upEvent, endDraw, false);
	
	app.interactProvider = isTouchSupported ? new TouchScreen() : new Mouse();
	
function startDraw(e){
	e.preventDefault();
	/*
	let x = isTouchSupported ? (e.targetTouches[0].pageX - app.canvas.offsetLeft) : (e.offsetX || e.layerX - app.canvas.offsetLeft);
	let y = isTouchSupported ? (e.targetTouches[0].pageY - app.canvas.offsetTop) : (e.offsetY || e.layerY - app.canvas.offsetTop);
  app.x = x;
  app.y = y;
  */
  app.pointer = app.interactProvider.adapt(e);
  app.curPainter.mouseDown(app.pointer);
  app.isDrawing = true;
};

function draw(e) {
	e.preventDefault();
	/*
	let x = isTouchSupported ? (e.targetTouches[0].pageX - app.canvas.offsetLeft) : (e.offsetX || e.layerX - app.canvas.offsetLeft);
	let y = isTouchSupported ? (e.targetTouches[0].pageY - app.canvas.offsetTop) : (e.offsetY || e.layerY - app.canvas.offsetTop);
	*/
	pointerBuf =  app.interactProvider.adapt(e);
	if(app.whiteBoard.touched(pointerBuf)){
		app.target = app.whiteBoard.mouseMove(pointerBuf);
	}
	if (app.isDrawing === true) {
		app.curPainter.mouseMove(pointerBuf);
		app.pointer = pointerBuf;
		//app.x = x;
		//app.y = y;
	}
	redraw();
	app.isMoving = (app.pointer.x != pointerBuf.x || app.pointer.y != pointerBuf.y);
};

function endDraw(e) {
	e.preventDefault();
	/*
	let x = isTouchSupported ? (e.targetTouches[0].pageX - app.canvas.offsetLeft) : (e.offsetX || e.layerX - app.canvas.offsetLeft);
	let y = isTouchSupported ? (e.targetTouches[0].pageY - app.canvas.offsetTop) : (e.offsetY || e.layerY - app.canvas.offsetTop);
	*/
  app.pointer = app.interactProvider.adapt(e);
  if (app.isDrawing === true) {
    //drawLine(app.pen, app.x, app.y, x, y);
	app.curPainter.finalize();
    //app.x = 0;
    //app.y = 0;
    app.isDrawing = false;
  }
};
/*
app.canvas.addEventListener('touchstart', e => {
	e.preventDefault();
	let touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
	app.x = touch.pageX;
	app.y = touch.pageY;
	app.curPainter.mouseDown(x, y);
	app.isDrawing = true;
});

app.canvas.addEventListener('touchmove', e => {
	e.preventDefault();
	let touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
	if(app.whiteBoard.touched(touch.pageX, touch.pageY)){
		app.target = app.whiteBoard.mouseMove(x, y);
	}
	if (app.isDrawing === true) {
		app.curPainter.mouseMove(x, y);
		app.x = x;
		app.y = y;
	}
	redraw();
	app.isMoving = (app.x != x || app.y != y);
});

window.addEventListener('touchend', e => {
	e.preventDefault();
  if (app.isDrawing === true) {
    //drawLine(app.pen, app.x, app.y, x, y);
	app.curPainter.finalize();
    app.x = 0;
    app.y = 0;
    app.isDrawing = false;
  }
});

window.addEventListener('touchcancel', e => {
	e.preventDefault();
  if (app.isDrawing === true) {
    //drawLine(app.pen, app.x, app.y, x, y);
	app.curPainter.finalize();
    app.x = 0;
    app.y = 0;
    app.isDrawing = false;
  }
});
*/
app.canvas.addEventListener('click', e => {
	e.preventDefault();
	/*
	let x = isTouchSupported ? (e.targetTouches[0].pageX - app.canvas.offsetLeft) : (e.offsetX || e.layerX - app.canvas.offsetLeft);
	let y = isTouchSupported ? (e.targetTouches[0].pageY - app.canvas.offsetTop) : (e.offsetY || e.layerY - app.canvas.offsetTop);
	*/
	app.pointer = app.interactProvider.adapt(e);
	if (app.isMoving) {
		let pt = new Point(app.pointer.x, app.pointer.y);
		pt.setColor(0, 0, 0, 0.9);
		app.whiteBoard.add(pt);
	}
});

window.addEventListener('resize', resizeCanvas, false);

	
});

function redraw(){
	app.whiteBoard.draw(app.pen);
};

    function resizeCanvas() {
            app.canvas.width = window.innerWidth;
            app.canvas.height = window.innerHeight;
			app.whiteBoard.setSize(window.innerWidth, window.innerHeight, true);

            /**
             * Your drawings need to be inside this function otherwise they will be reset when 
             * you resize the browser window and the canvas goes will be cleared.
             */
            redraw(); 
    };
/*
function drawLine(pen, x1, y1, x2, y2) {
  app.curDrawable.add(new Point(x2, y2));
};
*/
function undo(){
	eval(app.undoList.pop());
	redraw();
};

function find(id){
	if(id == '0'){
		return app.whiteBoard;
	}
	let parts = id.split('.');
	return advFind(app.whiteBoard, parts, 1);
};

function advFind(par, idArr, curIx){
	if(curIx == idArr.length){
		return par;
	}
	return advFind(par.children[idArr[curIx]], idArr, ++curIx);
};
