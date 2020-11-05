var hidService = (function() {

    var mseDown={stat:false};
    var containers={};

    function onwheel(cont,e) {
        var delta = 0;
        if (!event) event = window.event;
        if (event.wheelDelta) {
            delta = event.wheelDelta/120;
        } else if (event.detail) { // Mozilla
            delta = -event.detail/3;
        }
        e.delta=delta;
        for (var i = 0; i < cont.mseWheelHandlers.length; i++) {
            cont.mseWheelHandlers[i](e);
        }
        if (event.preventDefault) event.preventDefault();
        event.returnValue = false;
    }


    function setMouse(cont) {
        var div=cont.div;
        div.onmousedown=function (e) {
            mseDown.stat=true;
            mseDown.time=(new Date()).getTime();
            mseDown.pos={x:e.clientX,y:e.clientY};
        };
        div.onmouseup=function (e) {
            for(var i=0;i < cont.mseUpHandlers.length;i++) {
                mseDown.stat=false;
                e.mseDown=mseDown;
                cont.mseUpHandlers[i](e);
            }
        };
        div.onmousemove=function (e) {
            e.actTime=(new Date()).getTime();
            e.mseDown=mseDown;
            for(var i=0;i < cont.mseMoveHandlers.length;i++) {
                cont.mseMoveHandlers[i](e);
            }
        };
        var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";
        if (div.attachEvent) div.attachEvent("on"+mousewheelevt, function(e) {onwheel(e);});
        else if (div.addEventListener) div.addEventListener(mousewheelevt, function(e) {onwheel(cont,e);}, false);
    }

    function getContainerByDiv(div) {
        if (containers[div.id] === undefined)  {
            containers[div.id]={div: div,mseUpHandlers : [],mseMoveHandlers: [], mseWheelHandlers: []};
            setMouse(containers[div.id]);
            console.log("SET ", div.id);
        }
        var cont=containers[div.id];
        return cont;
    }

    function addMouseUpHandler(div,fn) {
        var cont=getContainerByDiv(div);
        cont.mseUpHandlers.push(fn);
    }

    function addMouseMoveHandler(div,fn) {
        var cont=getContainerByDiv(div);
        cont.mseMoveHandlers.push(fn);
    }

    function addMouseWheelHandler(div,fn) {
        var cont=getContainerByDiv(div);
        cont.mseWheelHandlers.push(fn);
    }

    function init() {
    }

    return {
        addMouseUpHandler: addMouseUpHandler,
        addMouseWheelHandler: addMouseWheelHandler,
        addMouseMoveHandler: addMouseMoveHandler,
        init: init
    };


})();