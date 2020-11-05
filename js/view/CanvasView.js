var canvasView = (function() {

    var layerId='tiles';
    var idsLayerId='ids';
    var paintNeeded=true;
    var divContainer;

    function paintGrid() {
        var tw=24;
        var th=24;
        var dim={w:2000,h:2000};
        var rx=tw/2;
        var ry=th/2;
        for(var i=0;i <= dim.h/th;i++) {
            for(var j=0;j <= (dim.w/tw);j++) {
                var p={x:(tw*j)+rx,y:(th*i)+ry};
                var rt={
                    p0:{x:p.x-rx,y:p.y-ry-100},
                    p1:{x:p.x+rx,y:p.y-ry-100},
                    p2:{x:p.x+rx,y:p.y+ry-100},
                    p3:{x:p.x-rx,y:p.y+ry-100}
                };
                gui.rect(layerId,rt,'#303030');
            }
        }
    }

    function toScr(p) {
        return {x:p.x/(th/tw),y:p.y}
    }



    function onresize() {
        if (divContainer !== undefined) {
            var toolBar = document.getElementById('tools');
            var vp = {width: document.body.clientWidth, height: document.body.clientHeight};
            divContainer.style.width = '' + (vp.width) + 'px';
            divContainer.style.height = '' + (vp.height-toolBar.clientHeight) + 'px';
            divContainer.style.top = '' + (toolBar.clientHeight) + 'px';
            var dim = meshView.fitToView();
//            gui.fitToViewport(layerId,dim,10);
//            gui.fitToViewport(idsLayerId,dim, 10);
            gui.onresize();
            paintNeeded=true;
        }
    }

    function paintView() {
        if (paintNeeded) {
            divContainer.style.backgroundColor=(toolBarView.isDarkMode() ? '#202422': '#F0F0F0');
            gui.clear(layerId);
            gui.clear(idsLayerId);
            if (toolBarView.isGrid()) paintGrid();
            var mesh=meshService.mesh();
            meshView.paint(mesh);
            paintNeeded=false;
        }
    }


    function scanForFace(p) {
        var idLy=gui.getLayer(idsLayerId);
        var cs=getComputedStyle(document.getElementById('tools'));
        var data = idLy.ctx.getImageData(p.x, p.y-parseInt(cs.height), 1, 1);
        var pix = data.data;
        var id=(pix[2]*65536)+(pix[1]*256)+pix[0];
        if (meshView.setSelected(id)) paintNeeded = true;
    }

    function onMouseMove(e) {
        if(e.mseDown.stat) {
            var ly=gui.getLayer(layerId);
            ly.mx+=e.movementX;
            ly.my+=e.movementY;
            var idLy=gui.getLayer(idsLayerId);
            idLy.mx=ly.mx;
            idLy.my=ly.my;
            paintView();
            paintNeeded=true; //Anim is necessary
        } else {
            scanForFace({x:e.clientX,y:e.clientY});
        }
    }


    function onMouseUp(e) {
        meshView.selectFace();
        paintNeeded = true;
    }

    function onWheel(e) {
        var d = 1.5;
        if (toolBarView.isWheelRotate()) {
            meshView.moveDegree((e.delta < 0) ? d : -d);
        } else if (toolBarView.isWheelOpacity()) {
            meshView.moveOpacity((e.delta < 0) ? .05 : -.05);
        } else {
            if (e.delta < 0) {
                gui.getLayer(layerId).mag *= d;
                gui.getLayer(idsLayerId).mag *= d;
            }
            else {
                gui.getLayer(layerId).mag /= d;
                gui.getLayer(idsLayerId).mag /= d;
            }
        }
        paintNeeded=true;
    }

    function init(divCont,fn) {
        divContainer=divCont;
        gui.addDefaultLayer(divContainer,idsLayerId,true);
        gui.addDefaultLayer(divContainer,layerId);
        util.adiv(divContainer,'crsr_pane');
        gui.init(0);
        onresize();

        meshView.init(layerId);

        hidService.addMouseMoveHandler(divContainer,onMouseMove);
        hidService.addMouseUpHandler(divContainer,onMouseUp);
        hidService.addMouseWheelHandler(divContainer,onWheel);
        animService.addAnimHandler(paintView);
        fn();
    }

    function requestRepaint() {
        paintNeeded=true;
    }


    return {
        init: init,
        requestRepaint: requestRepaint,
        onresize : onresize
    };

})();


