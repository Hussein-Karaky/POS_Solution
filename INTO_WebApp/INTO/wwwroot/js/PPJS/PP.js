// global namespace
var PeoPoint = PeoPoint || {};
// sub namespace
PeoPoint.event = {};
// Create container called PeoPoint.commonMethod for common method and properties
PeoPoint.commonMethod = {
    regExForName: "", // define regex for name validation
    regExForPhone: "", // define regex for phone no validation
    validateName: function (name) {
        // Do something with name, you can access regExForName variable
        // using "this.regExForName"
    },

    validatePhoneNo: function (phoneNo) {
        // do something with phone number
    }
}

// Object together with the method declarations
PeoPoint.event = {
    addListener: function (el, type, fn) {
        //  code stuff
    },
    removeListener: function (el, type, fn) {
        // code stuff
    },
    getEvent: function (e) {
        // code stuff
    }
    // Can add another method and properties
}

//Syntax for Using addListner method:
//PeoPoint.event.addListener("yourel", "type", callback);
/*
$.fn.old_append = $.fn.append;
$.fn.append = function(p){
    //alert("Attempt to append something...");
    //alert(p.constructor.name);
    if(PeoPoint.prototype == p){
        $(p).offset({left:$("#main").width()/2 - $(p).width()/2 , top:$("#main").height()/2 - $(p).height()/2});
    }
    return this.old_append.apply(this, arguments);
};
*/
$(document).ready(function (e) {
    $.event.special.tap.tapholdThreshold = 500;
});

$(window).resize(function () {
    //$('body').prepend('<div>' + $(window).width() + '</div>');
    current.relocateDisplay();
    current.adjustDisplay();
    current.repaint();
});

function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

PeoPoint.AccessType = {
    Public: 1,
    Protected: 2,
    Private: 3,
    Custom: 4
}

PeoPoint.LifeType = {
    Permanent: 1,
    Temporary: 2,
    Volatile: 3,
    Conditional: 4,
    Dead: 5
}

PeoPoint.DisplayState = {
    Minimized: 0,
    Maximized: 1,
    Expanded: 2,
    Secondary: 3
}

PeoPoint.Clicks = 0;

PeoPoint.Clicked = false;

PeoPoint.Tapped = false;

PeoPoint.NewLocalID = function () {
    var date = new Date();
    var localID = date.getYear() * 10000000000000 + date.getMonth() * 100000000000 + date.getDay() * 1000000000 + date.getHours() * 10000000 + date.getMinutes() * 100000 + date.getSeconds() * 1000 + date.getMilliseconds();
    return localID;
}

PeoPoint.VideoTemplate = function () {
    var videoEl = "<video width='320' height='240' controls><source src='<video_url>' type='<video_type>'></video>";
    return videoEl;
}

PeoPoint.DisplayWidth = function () {
    return $(window).width() > $(window).height() ? $(window).height() : $(window).width();
}

PeoPoint.Pin = function () {
    this.id = "",
        this.x = 0,
        this.y = 0,
        this.connected = false,

        this.setId = function (id_) {
            this.id = id_;
        },

        this.setLocation = function (x_, y_) {
            this.x = x_;
            this.y = y_;
        }
}

PeoPoint.Token = function () {
    this.path = new Array();
    this.pass = function (id) {
        this.path.push(id);
    },

        this.passed = function (id) {
            return this.path.indexOf(id) > -1;
        }
}

PeoPoint.Link = function () {
    this.id = "",
        this.virtualX = 0,
        this.virtualY = 0,
        this.first = null,
        this.second = null,
        this.angle = 0,
        this.length = 0,

        this.setId = function (id_) {
            this.id = id_;
        },

        this.makeWebRep = function () {
            var newdiv = document.createElement('div');
            var divIdName = PeoPoint.PPoint.UIIPrefix + this.id;
            newdiv.setAttribute("id", divIdName);
            newdiv.setAttribute("class", "relation");
            return newdiv;
        },

        this.getWebRep = function () {
            var id = "#" + PeoPoint.PPoint.UIIPrefix + this.id;
            return $(id)[0];
        },

        this.paint = function (token) {
            //alert("token passing link " + this.id + "...");
            if (!token.passed(this.id)) {
                var Ar, cos, sin, r, cx, cy, adj, Xr, Yr, X2, Y2;
                //			$(this.getWebRep()).remove();
                this.hide()
                if (!this.getWebRep()) {
                    //$("#main").append(this.makeWebRep());
                    this.show();
                }
                Ar = rad(this.angle);
                cos = Math.cos(Ar);
                sin = Math.sin(Ar);
                r = this.length / 2;
                cx = current.getDisplayCenterX();
                cy = current.getDisplayCenterY();
                adj = r * cos;
                Xr = cx - adj;
                Yr = cy + Math.sqrt(Math.pow(r, 2) - Math.pow(adj, 2)) * (0 - sin / Math.abs(sin));
                $(this.getWebRep()).width(this.length);
                $(this.getWebRep()).offset({ left: Xr - r, top: Yr });
                $(this.getWebRep()).rotate(this.angle);
                X2 = cx - this.length * cos - PeoPoint.PPoint.SecondaryRadius();
                Y2 = cy - this.length * sin - PeoPoint.PPoint.SecondaryRadius();
                this.second.setLocation(X2, Y2);
                token.pass(this.id);
                this.first.paint(token);
                this.second.paint(token);
                //alert(r);
            }
        },

        this.hide = function () {
            $(this.getWebRep()).remove();
            this.second.hide();
        },

        this.show = function () {
            $("#main").append(this.makeWebRep());
            this.second.show();
        }
}

PeoPoint.Link.IdPrefix = "ppr_";
//PeoPoint.Link.Length = 200;

PeoPoint.PPoint = function () {
    this.id = "",
        this.displayState = PeoPoint.DisplayState.Minimized,
        this.X = ($(window).width() - exec(PeoPoint.PPoint.Widths[this.displayState])) / 2,
        this.Y = ($(window).height() - exec(PeoPoint.PPoint.Widths[this.displayState])) / 2,
        this.name = "",
        this.desc = "",
        this.imageURL = "",
        this.videoURL = "",
        this.lifeType = "",
        this.accessType = "",
        this.hasFocus = false,
        this.relatives = [],
        this.links = [],
        this.currentActions = new Array(),

        this.setName = function (_name) {
            this.name = _name;
            //alert($(this.getWebRep()).attr("id"));
            var id = "#" + PeoPoint.PPoint.IdPrefix + this.name;
            $(id).attr("id", PeoPoint.PPoint.IdPrefix + name);
        },

        this.setLocation = function (x, y) {
            this.X = x;
            this.Y = y;
        },

        this.focus = function () {
            if (!this.hasFocus) {
                current = this;
                this.hasFocus = true;
                $("#main").empty();
                this.displayState = PeoPoint.DisplayState.Minimized;
                this.initEvents();
                //if(current.displayState == PeoPoint.DisplayState.Expanded){
                //	current.collapse();
                //}
                this.relocateDisplay();
                this.repaint();
            }
            //this.repaint();
        },

        this.setImageURL = function (_imageURL) {
            if (_imageURL) {
                this.imageURL = _imageURL;
                $(this.getWebRep()).css("background-image", "url('" + _imageURL + "')");
            }
        },

        this.makeWebRep = function () {
            //alert("makeWebRep");
            var webRep = document.createElement('div');
            var divIdName = PeoPoint.PPoint.UIIPrefix + this.id;
            webRep.setAttribute("id", divIdName);
            webRep.setAttribute("class", PeoPoint.PPoint.Classes[this.displayState]);
            webRep.setAttribute("style", "background-image:url('" + this.imageURL + "');");
            //$(webRep).offset({left: this.X, top: this.Y});
            //$(webRep).width(PeoPoint.PPoint.Widths[this.displayState]);
            //$(webRep).height(PeoPoint.PPoint.Heights[this.displayState]);
            $(webRep).width(1);//PeoPoint.PPoint.Widths[this.displayState]);
            $(webRep).height(1);//PeoPoint.PPoint.Heights[this.displayState]);
            return webRep;
        },

        this.show = function () {
            //alert("showing " + this.id);
            if (!this.getWebRep()) {
                drawPPoint(this);
            }
            else {
                $(this.getWebRep()).show();
                this.initEvents();
            }
            if (this.displayState == PeoPoint.DisplayState.Expanded) {
                this.adjustDisplay();
                //for(i = 0; i < this.links.length; i++){
                //	this.links[i].show();
                //}
            }
        },

        this.hide = function () {
            if (this.displayState == PeoPoint.DisplayState.Expanded) {
                for (i = 0; i < this.links.length; i++) {
                    this.links[i].hide();
                }
            }
            $(this.getWebRep()).remove();
        },

        this.getWebRep = function () {
            var id = "#" + PeoPoint.PPoint.UIIPrefix + this.id;
            return $(id)[0];
        },

        this.bindAction = function (event, action) {

        },

        this.getInstForm = function () {
            return "<div id=\"ppInst\"><table><tr><td>Name</td><td><input id=\"txtinName\" type=\"text\"></td></tr><tr><td>Description</td><td><input id=\"txtinDesc\" 		type=\"text\"></td></tr><tr><td><input id=\"ppinitOK\" type=\"button\" value=\"OK\"/></td><td><input id=\"ppinitCancel\" type=\"button\" value=\"Cancel\"/></td></tr></table></div>";
        },

        this.showInstForm = function () {
            var instForm = this.getInstForm();
            $("#main").append(instForm);
            $("#ppinitOK").click(function () { var ppoint = new PPoint(); drawPPoint(ppoint.init()); });
            $("#ppinitCancel").click(function () { $("#ppInst").hide(); });
        },

        this.init = function () {
            this.id = $("ppInst").attr("id");
            this.name = $("ppInst txtinName").val();
            this.desc = $("ppInst txtinDesc").val();
            return this;
        },

        this.addPoint = function (p) {
            var link = new PeoPoint.Link();
            link.id = PeoPoint.Link.IdPrefix + this.links.length;
            link.first = this;
            p.displayState = PeoPoint.DisplayState.Secondary;
            link.second = p;
            this.links.push(link);
            if (this.hasFocus) {
                this.adjustDisplay();
                if (this.displayState == PeoPoint.DisplayState.Expanded) {
                    this.collapse();
                    if (this.displayState == PeoPoint.DisplayState.Minimized) {
                        this.expand();
                    }
                }
            }
        },

        this.adjustDisplay = function () {
            //alert("adjustDisplay: " + this.links.length);
            if (this.links.length > 1) {
                var ang = 360 / this.links.length;
                this.links[0].angle = ang;
                this.links[0].length = PeoPoint.PPoint.LinkLength();
                for (i = 1; i < this.links.length; i++) {
                    this.links[i].angle = this.links[i - 1].angle + ang;
                    this.links[i].length = PeoPoint.PPoint.LinkLength();
                }
            }
            this.repaint();
        },

        this.getDisplayWidth = function () {
            return $(this.getWebRep()).width();
        },

        this.getDisplayHeight = function () {
            return $(this.getWebRep()).height();
        },

        this.getDisplayX = function () {
            return this.X;
        },

        this.getDisplayY = function () {
            return this.Y;
        },

        this.getDisplayCenterX = function () {
            return this.getDisplayX() + exec(PeoPoint.PPoint.Widths[this.displayState]) / 2;
        },

        this.getDisplayCenterY = function () {
            return this.getDisplayY() + exec(PeoPoint.PPoint.Widths[this.displayState]) / 2;
        },

        this.relocateDisplay = function () {
            if (this.hasFocus) {
                this.setLocation(($(window).width() - exec(PeoPoint.PPoint.Widths[this.displayState])) / 2, ($(window).height() - exec(PeoPoint.PPoint.Widths[this.displayState])) / 2);
            }
        },

        this.relocateDisplayByState = function (dispState) {
            if (this.hasFocus) {
                this.setLocation(($(window).width() - exec(PeoPoint.PPoint.Widths[dispState])) / 2, ($(window).height() - exec(PeoPoint.PPoint.Widths[dispState])) / 2);
            }
        },

        this.centerAt = function () {

        },

        this.expand = function () {
            this.displayState = PeoPoint.DisplayState.Expanded;
            /*		for(i = 0; i < this.links.length; i++){
                        this.links[i].show();
                    }
                    this.repaint();*/
            this.adjustDisplay();
        },

        this.collapse = function () {
            this.displayState = PeoPoint.DisplayState.Minimized;
            for (i = 0; i < this.links.length; i++) {
                this.links[i].hide();
            }
            this.repaint();
        },

        this.beginMaximize = function () {
            this.begin("endMaximize");
            this.setLocation(($(window).width() - exec(PeoPoint.PPoint.Widths[PeoPoint.DisplayState.Maximized])) / 2, ($(window).height() - exec(PeoPoint.PPoint.Widths[PeoPoint.DisplayState.Maximized])) / 2);
            var p = this;
            $(this.getWebRep()).animate({ left: p.X, top: p.Y, width: exec(PeoPoint.PPoint.Widths[PeoPoint.DisplayState.Maximized]), height: exec(PeoPoint.PPoint.Widths[PeoPoint.DisplayState.Maximized]), borderRadius: 10 }, { step: function (now, fx) { p.relocateDisplayByState(PeoPoint.DisplayState.Maximized); }, duration: 100 }, "linear", function () { });
        },

        this.endMaximize = function () {
            //alert("endMaximize");
            this.displayState = PeoPoint.DisplayState.Maximized;
        },

        this.beginMinimize = function () {
            this.begin("endMinimize");
            this.setLocation(($(window).width() - exec(PeoPoint.PPoint.Widths[PeoPoint.DisplayState.Minimized])) / 2, ($(window).height() - exec(PeoPoint.PPoint.Widths[PeoPoint.DisplayState.Minimized])) / 2);
            var p = this;
            $(this.getWebRep()).animate({ left: p.X, top: p.Y, width: exec(PeoPoint.PPoint.Widths[PeoPoint.DisplayState.Minimized]), height: exec(PeoPoint.PPoint.Widths[PeoPoint.DisplayState.Minimized]), borderRadius: 110 }, { step: function () { p.relocateDisplayByState(PeoPoint.DisplayState.Minimized); }, duration: 100 }, "linear", function () { });
        },

        this.endMinimize = function () {
            alert("endMinimize");
            this.displayState = PeoPoint.DisplayState.Minimized
        },

        this.repaint = function () {
            this.paint(new PeoPoint.Token());
        },

        this.paint = function (token) {
            if (!token.passed(this.id)) {
                //alert("painting point " + token.passed(this.id));
                token.pass(this.id);
                if (!this.getWebRep()) {
                    $("#main").append(this.makeWebRep());
                }		//alert("this.getWebRep().id " + this.getWebRep().id);
                if (PeoPoint.PPoint.Animate == true) {
                    $(this.getWebRep()).offset({ left: this.X + exec(PeoPoint.PPoint.Widths[this.displayState]) / 2, top: this.Y + exec(PeoPoint.PPoint.Widths[this.displayState]) / 2 });
                    $(this.getWebRep()).width(1);
                    $(this.getWebRep()).height(1);
                    $(this.getWebRep()).animate({ left: this.X, top: this.Y, width: exec(PeoPoint.PPoint.Widths[this.displayState]), height: exec(PeoPoint.PPoint.Widths[this.displayState]) }, 200);
                } else {
                    $(this.getWebRep()).offset({ left: this.X, top: this.Y });
                }
                if (this.displayState == PeoPoint.DisplayState.Expanded) {
                    for (i = 0; i < this.links.length; i++) {
                        this.links[i].paint(token);
                    }
                    $(PeoPoint.PPoint.ClassSelect[PeoPoint.DisplayState.Secondary]).animate({ width: exec(PeoPoint.PPoint.Widths[PeoPoint.DisplayState.Secondary]), height: exec(PeoPoint.PPoint.Widths[PeoPoint.DisplayState.Secondary]) }, 200);
                }
            }
        },

        this.begin = function (action) {
            if (this.currentActions.indexOf(action) == -1) {
                this.currentActions.push(action);
            }
        },

        this.cancel = function () {
            if (this.currentActions.length > 0) {
                this.currentActions.splice(this.currentActions.length - 1, 1);
            }
        },

        this.end = function () {
            //alert("end");
            if (this.currentActions.length > 0) {
                var fnc = this.currentActions[this.currentActions.length - 1];
                this.currentActions.splice(this.currentActions.length - 1, 1);
                //this[fnc];
                //var context = context || this;
                this[fnc]();
                //PeoPoint.PPoint().endMaximize.call(this);
            }
        },

        this.initEvents = function () {
            //alert("initializing events...");
            //alert("binding taphold...");
            var p = this;
            $(this.getWebRep()).bind("taphold", function (event) {
                //alert("taphold");
                p.preTapHold();
            });
            /*
            $(this.getWebRep()).bind( "tap", function(event){
                if(p.displayState==PeoPoint.DisplayState.Minimized || p.displayState==PeoPoint.DisplayState.Expanded){
                    PeoPoint.Tapped = true; setTimeout(function(){p.tap();}, 200);
                }
            });
            */
            $(p.getWebRep()).click(function () {
                //	p.preclick();
            });

            $(p.getWebRep()).dblclick(function () {
                p.doubleClick();
            });
            //$(p.getWebRep()).on("doubletap", function() {
            //	p.doubleClick();
            //});
            $(p.getWebRep()).mousedown(function () {
                p.pressed();
            });
            $(p.getWebRep()).mouseup(function () {
                p.released();
            });
        },

        this.preTapHold = function () {
            if (this.displayState == PeoPoint.DisplayState.Minimized || this.displayState == PeoPoint.DisplayState.Maximized) {
                this.taphold();
            }
        },

        this.taphold = function () {
            if (this.displayState == PeoPoint.DisplayState.Minimized) {
                this.beginMaximize();
                //alert(this.displayState);
            } else if (this.displayState == PeoPoint.DisplayState.Maximized) {
                this.beginMinimize();
            } else if (this.displayState == PeoPoint.DisplayState.Expanded) {
                this.collapse();
            }
        },

        this.click = function () {
            PeoPoint.Clicks = 0;
            if (this.displayState == PeoPoint.DisplayState.Minimized) {
                this.expand();
            } else if (this.displayState == PeoPoint.DisplayState.Expanded) {
                this.collapse();
            }
        },

        this.preclick = function () {
            PeoPoint.Clicks++;
            if (this.displayState == PeoPoint.DisplayState.Minimized || this.displayState == PeoPoint.DisplayState.Expanded) {
                var p = this;
                setTimeout(function () { p.click(); }, 200);
            } else if (this.displayState == PeoPoint.DisplayState.Secondary) {
                this.focus();
                this.show();
            }
        },

        this.doubleClick = function () {
            PeoPoint.Clicks = 0;
            clearTimeout();
            if (this.displayState == PeoPoint.DisplayState.Expanded) {
                this.collapse();
                this.beginMaximize();
            } else
                if (this.displayState == PeoPoint.DisplayState.Minimized) {
                    this.beginMaximize();
                } else
                    if (this.displayState == PeoPoint.DisplayState.Maximized) {
                        this.beginMinimize();
                    }
        },

        this.pressed = function () {

            var p = this;
            //alert($(this.getWebRep()).width());
            $(this.getWebRep()).animate({ left: p.X - 5, top: p.Y - 5, width: $(p.getWebRep()).width() + 10, height: $(p.getWebRep()).height() + 10 }, 200, "easeOutQuint", function () { p.end(); p.preTapHold(); });
        },

        this.released = function () {

            var p = this;
            //alert($(this.getWebRep()).width());
            $(this.getWebRep()).animate({ left: p.X, top: p.Y, width: exec(PeoPoint.PPoint.Widths[p.displayState]), height: exec(PeoPoint.PPoint.Widths[p.displayState]) }, 300, "swing", function () { p.end(); p.preclick(); });
        }
}

PeoPoint.PPoint.IdPrefix = "pp_";
PeoPoint.PPoint.UIIPrefix = "UI_";

//PeoPoint.PPoint.MiniWidth = 200;
//PeoPoint.PPoint.MaxWidth = 500;
//PeoPoint.PPoint.ExpWidth = 200;
//PeoPoint.PPoint.SecondaryWidth = 100;

PeoPoint.PPoint.MiniWidth = function () {
    return (parseInt(PeoPoint.DisplayWidth() / 10, 10) * 10) / 3;
};
PeoPoint.PPoint.MaxWidth = function () {
    return (parseInt(PeoPoint.DisplayWidth() / 10, 10) * 10);
};
PeoPoint.PPoint.ExpWidth = function () {
    return (parseInt(PeoPoint.DisplayWidth() / 10, 10) * 10) / 3;
};
PeoPoint.PPoint.SecondaryWidth = function () {
    return (PeoPoint.DisplayWidth() - PeoPoint.PPoint.ExpWidth()) / 4;
};

PeoPoint.PPoint.Widths = new Array("PeoPoint.PPoint.MiniWidth", "PeoPoint.PPoint.MaxWidth", "PeoPoint.PPoint.ExpWidth", "PeoPoint.PPoint.SecondaryWidth");

PeoPoint.PPoint.MiniHeight = 200;
PeoPoint.PPoint.MaxHeight = 500;
PeoPoint.PPoint.ExpHeight = 200;
PeoPoint.PPoint.SecondaryHeight = 100;

PeoPoint.PPoint.Heights = new Array(PeoPoint.PPoint.MiniHeight, PeoPoint.PPoint.MaxHeight, PeoPoint.PPoint.ExpHeight, PeoPoint.PPoint.SecondaryHeight);

PeoPoint.PPoint.MiniRadius = 100;
PeoPoint.PPoint.MaxRadius = 250;
PeoPoint.PPoint.ExpRadius = 200;
PeoPoint.PPoint.SecondaryRadius = 100;

PeoPoint.PPoint.Radius = new Array(PeoPoint.PPoint.MiniRadius, PeoPoint.PPoint.MaxRadius, PeoPoint.PPoint.ExpRadius, PeoPoint.PPoint.SecondaryRadius);

PeoPoint.PPoint.Classes = new Array("peopoint minimized", "peopoint maximized", "peopoint expanded", "peopoint secondary");

PeoPoint.PPoint.ClassSelect = new Array(".peopoint.minimized", ".peopoint.maximized", ".peopoint.expanded", ".peopoint.secondary");

PeoPoint.PPoint.NormalRadius = function () {
    return PeoPoint.PPoint.NormalWidth / 2;
}

//PeoPoint.PPoint.FocusRadius = function(){
//	return PeoPoint.PPoint.FocusWidth/2;
//}

PeoPoint.PPoint.FocusWidth = function () {
    return (parseInt(PeoPoint.DisplayWidth() / 10, 10) * 10) / 3;
}

PeoPoint.PPoint.SecondaryWidth = function () {
    return (PeoPoint.DisplayWidth() - PeoPoint.PPoint.FocusWidth()) / 4;
}

PeoPoint.PPoint.SecondaryRadius = function () {
    return PeoPoint.PPoint.SecondaryWidth() / 2;
}

PeoPoint.PPoint.LinkLength = function () {
    return PeoPoint.PPoint.FocusWidth();
}

PeoPoint.PPoint.Animate = true;

drawPPoint = function (p) {
    //alert("drawPPoint...");
    p.relocateDisplay();
    p.repaint();
    if (p.hasFocus) {
        //alert("focusing...");
        current = p;
        //alert("$(p.getWebRep()).id " + $(p.getWebRep()).id);
    }
    p.initEvents();
    //p.repaint();
}

exec = function (functionName) {
    return execute(functionName, window, null);
}

function execute(functionName, context, arguments) {
    //  var args = [].slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(this, arguments);
}

PeoPoint.PPoints = [];

var current = new PeoPoint.PPoint();
//current.id = "pp@main";
current.name = "";
current.desc = "Root";

function drawMeter() {
    for (h = 1; h <= 30; h++) {
        $("#main").append("<div id=\"divMeterH" + h + "\" class=\"meter\"><\/div>");
        var id = "#divMeterH" + h;
        ppMov(id, 0, h * 30);
        $(id).width(1400);
        $(id).height(1);
    }
    for (v = 1; v <= 50; v++) {
        $("#main").append("<div id=\"divMeterV" + v + "\" class=\"meter\"><\/div>");
        var id = "#divMeterV" + v;
        ppMov(id, v * 30, 0);
        $(id).height(1000);
        $(id).width(1);
    }
}

function resizeRelation(id, w) {
    var rel = $(id);
    //alert(id);
    //alert(rel.position().left);
    var wdiff = w - rel.width();
    var nl = rel.position().left - wdiff / 2;
    rel.offset({ left: nl });
    rel.width(w);
}

function relW(rel, w) {
    var id = "#" + rel.id;
    var relD = $(id);
    //alert(id);
    //alert(rel.position().left);
    var wdiff = w - relD.width();
    var nl = relD.position().left - wdiff / 2;
    relD.offset({ left: nl });
    rel.width = w;
    relD.width(w);
}

function ppMov(id, x, y) {
    var pp = $(id);
    pp.offset({ left: x, top: y });
}

function splitToRels(relNum) {
    var rels = new Array(relNum);

    var ang = 360 / relNum;
    rels[0] = { id: "div0", angle: ang, width: 150, Cx: 650, Cy: 350 };
    relPaint(rels[0]);
    for (i = 1; i < rels.length; i++) {
        rels[i] = { id: "div" + i, angle: rels[i - 1].angle + ang, width: 150, Cx: 650, Cy: 350 };
        relPaint(rels[i]);
    }
}

function circle(x) {

}

function rad(a) {
    return a * 0.0174532925;
}
