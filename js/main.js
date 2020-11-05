
var main = (function () {


    var imgDeg=0;
    var magRotMode=0; // 0 magnify, 1 : rotate;
    var linesOff=0; // 0 ON, 1 OFF;
    var divContainer=document.getElementById('content');

    function rePaint() {
//        canvasView.paintView();
    }


    function getMousePosOnElem(evt,elem) {
        var obj = evt.target;
        var top = 0;
        var left = 0;
        var fnd=false;
        while (obj.tagName !== 'BODY') {
            if (obj === elem) {
                fnd=true;
            }
            if (fnd) {
                top += obj.offsetTop;
                left += obj.offsetLeft;
            }
            obj = obj.offsetParent;
        }
        var mouseX = evt.clientX - left + window.pageXOffset;   
        var mouseY = evt.clientY - top + window.pageYOffset;
        return {
            x: mouseX,
            y: mouseY
        };
    }

    var mseStat=0;
    var msel={x : 0,y: 0};
    var lastClick=0;

    function onMouseUp(e) {
        var cont=document.getElementById('content');
        var epos=getMousePosOnElem(e,cont);
        onResize();
        mseStat=0;
        if (event.preventDefault) event.preventDefault();
        var act=(new Date()).getTime();
        if (act-400 < lastClick) {
            var msep={x:epos.x-cont.offsetLeft,y:epos.y-cont.offsetTop};
            handleModeAction(msep);
        }
        lastClick=act;
        rePaint();
    }

    function onMouseDown(e) {
        var cont=document.getElementById('content');
        var msepos=getMousePosOnElem(e,cont);
        mseStat=1;
        msel.x=msepos.x;
        msel.y=msepos.y;
    }


    function moveByPos(p) {
        gui.moveByPos('canvas',p);
    }

    function onMouseMove(e) {
        var cont=document.getElementById('content');
        var msepos=getMousePosOnElem(e,cont);
		if (mseStat === 1) {
            var dx=(msepos.x-msel.x);
            var dy=(msepos.y-msel.y);
            moveByPos({x : dx,y : dy});
            msel.x=msepos.x;
            msel.y=msepos.y;
            rePaint();
        } else {
            var msep={x:msepos.x-cont.offsetLeft,y:msepos.y-cont.offsetTop};
        }
/*        var gp=gui.getInvXY('canvas',{x:msepos.x,y:msepos.y});
        gui.cross('canvas',gp,'#FF0000');
        console.log(gp);
        document.getElementById('divStatus').innerHTML='x:'+gp.x+'<br>:y'+gp.y;*/
    }

    function handleWheel(delta,pos) {
        if(magRotMode === 0) {
            if (delta < 0) {
                gui.magMinus('canvas',pos);
            } else {
                gui.magPlus('canvas',pos);
            }
        } else {
            if (delta < 0) {
                imgDeg=(imgDeg >= 360 ? 0 : imgDeg+1);
            } else {
                imgDeg=(imgDeg < 0 ? 359 : imgDeg-1);
            }
        }
        onResize();
    }
    
    function wheel(event) {
        var msepos=getMousePosOnElem(event,document.getElementById('content'));
        var delta = 0;
        if (!event) event = window.event;
        if (event.wheelDelta) {
            delta = event.wheelDelta/120;
        } else if (event.detail) { /** Mozilla case. */
            delta = -event.detail/3;
        }
        if (delta) handleWheel(delta,msepos);
        if (event.preventDefault) event.preventDefault();
        event.returnValue = false;
    }


    function createToolButton(pdiv,label,fn,lblid) {
        var butt=document.createElement('div');
        butt.className='toolbutton';
        pdiv.appendChild(butt);
        butt.onclick=fn;
        var divLbl=document.createElement('div');
        divLbl.className='buttontext';
        butt.appendChild(divLbl);
        if (lblid !== undefined) divLbl.id=lblid;
        divLbl.innerHTML=label;
    }



    function createSelectButton(pdiv,id,txt,vals,fldname,width,fn) {
        var butt=util.adiv(pdiv,id,'toolselectbutton');
        butt.style.width=''+width+'px'; 

        var sel=document.createElement('select');
        butt.appendChild(sel);
        sel.className='toolbarselect';
        sel.id='tbsel_'+id;
        sel.onchange=function(e) {fn(e);};
        for(var i=0;i < vals.length;i++) {
            var opt=document.createElement('option');
            opt.innerHTML=vals[i][fldname];
            opt.value=''+i;
            sel.appendChild(opt);
        }
    }

    function createInputButton(pdiv,id,txt,val,width,fn) {
        var div=util.adiv(pdiv,id,'toolselectbutton');
        div.style.width=''+width+'px';

        var lbl=util.adivhtml(div,'','toollabel',txt);
        var inp=document.createElement('input');
        div.appendChild(inp);
        inp.id='tbinput_'+id;
        inp.onchange=function(e) {fn(e);};
    }


    function createSliderButton(pdiv,id,txt,rmin,rmax,rstep,val,width,fn) {
        var butt=util.adiv(pdiv,id,'toolselectbutton');
        butt.style.width=''+width+'px';

        var sel=document.createElement('input');
        sel.type='range';
        sel.min=rmin;
        sel.max=rmax;
        sel.step=rstep;
        sel.value=val;
        butt.appendChild(sel);
        sel.id='tbslider_'+id;
        sel.onchange=function(e) {fn(e);};
    }


    function setLoadButton(pdiv) {
        var butt=util.adiv(pdiv,'','toolbutton');
        var idiv=util.adiv(butt,'','upload');
        var inp=document.createElement('input');
        inp.type='file';
        inp.id='inpUpload';
        inp.addEventListener('change', 
            function(e) {
                document.getElementById('tbinput_objectName').value='';
                if (e.target.files.length > 0) {
                    var file = e.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function(ee) {
                        if (ee.target.readyState == FileReader.DONE) {
                            mImggen.load(ee.target.result);
                            onResize();
                        }
                    };
                    reader.readAsText(file);
                }
            }
            , false);        
        idiv.appendChild(inp);
        var lbl=document.createElement('label');
        lbl.setAttribute('for','inpUpload');
        lbl.innerHTML='Load';
        idiv.appendChild(lbl);
    }


    function setX3dLoadButton(pdiv) {
        var butt=util.adiv(pdiv,'','toolbutton');
        var idiv=util.adiv(butt,'','upload');
        var inp=document.createElement('input');
        inp.type='file';
        inp.id='inpX3dUpload';
        inp.addEventListener('change', 
            function(e) {
                document.getElementById('tbinput_objectName').value='';
                if (e.target.files.length > 0) {
                    var file = e.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function(ee) {
                        if (ee.target.readyState == FileReader.DONE) {
                            mImggen.loadX3d(ee.target.result);
                            onResize();
                        }
                    };
                    reader.readAsText(file);
                }
            }
            , false);        
        idiv.appendChild(inp);
        var lbl=document.createElement('label');
        lbl.setAttribute('for','inpX3dUpload');
        lbl.innerHTML='Load x3d';
        idiv.appendChild(lbl);
    }



    function initFileTools() {
        var pdiv=document.getElementById('filetools');
        pdiv.innerHTML='';
/*        createToolButton(pdiv,'New',function(e) {
            if (confirm("New: Are you sure?")) {
                document.getElementById('tbinput_objectName').value='';
                mImggen.clear();
                onResize();
            }
        });*/

        createToolButton(pdiv,'New',function(e) {
            mImggen.newFile();
            onResize();
        });


        setLoadButton(pdiv);
        setX3dLoadButton(pdiv);
        createToolButton(pdiv,'Save',function(e) {
            mImggen.saveToFile();
            onResize();
        });
        createToolButton(pdiv,'Cloud',function(e) {
            mImggen.saveToServer();
            onResize();
        });
        createToolButton(pdiv,'Img',function(e) {
            mImggen.toImage();
        });

/*        
        createToolButton(pdiv,'Cyl',function(e) {
            mImggen.createCyl(76,4500,8,{r:255,g:180,b:180,a:1});
            mImggen.createCyl(60,8000,8,{r:255,g:180,b:180,a:1});
            mEditorPane.init(mImggen.getObject());
            onResize();
        });*/
    }

    function setToolbar() {
        var tooldiv=document.getElementById('tooldiv');
        tooldiv.innerHTML="";

        createToolButton(tooldiv,'View',function(e) {
            if (gui.mode('canvas') === 0) {
                gui.mode('canvas',1);
            }
            else {
                gui.mode('canvas',0);
            }
            onResize();
            var r=mImggen.getRect();
            gui.fitToViewports(r);
            onResize();
        });


        createToolButton(tooldiv,'Magnify',function(e) {
            var lbl=document.getElementById('magrot');
            if (magRotMode === 0) {
                magRotMode=1;
                lbl.innerHTML='Rotate';
            }
            else {
                lbl.innerHTML='Magnify';
                magRotMode=0;
            }
        },'magrot');


        createToolButton(tooldiv,'Lines<br>ON',function(e) {
            var lbl=document.getElementById('linesOff');
            if (linesOff === 0) {
                linesOff=1;
                lbl.innerHTML='Lines<br>OFF';
            }
            else {
                lbl.innerHTML='Lines<br>ON';
                linesOff=0;
            }
        },'linesOff');



        createToolButton(tooldiv,'Fit',function(e) {
            onresize();
            var r=mImggen.getRect();
            gui.fitToViewports(r);
            onresize();
        });

        createToolButton(tooldiv,'Conv',function(e) {
            onresize();
            mImggen.conv();
            onresize();
        });


        createSliderButton(tooldiv,'opaque','Opacity',0.1,1.0,0.1,0.1,200,function(e) {mImggen.setOpacity(e.target.value);});
        createInputButton(tooldiv,'objectName','Name','',200,function(e) {mImggen.setName(e.target.value);});
    }
    
    
    function onKeyUp(e) {
        if (e.keyCode === 46) { // Del
            onresize();
        }
        if (e.keyCode === 81) { // Q 
		}
        if (e.keyCode === 68) { // D
            onresize();
        }
        if (e.keyCode === 69) { // E
        }
    	if (e.keyCode === 83) { // S 
		}
        if (e.keyCode === 84) { // T
            onresize();
        }
	    if (e.keyCode === 77) {
	    }
		if (e.keyCode === 87) { // W
		}
        if (e.keyCode === 65) { // A
        }
        if (e.keyCode === 70) { // F 
        }
        if (e.keyCode === 71) { // G 
        }
    }   


    function handleModeAction(gpos) {
    }


    function onresize() {
        canvasView.onresize();
//        mEditorPane.onResize();
//        mImggen.paint(imgDeg);
    }


    function frameTimer() {
        var anyMoved=mConsist.timer();
        if (anyMoved) mConsistView.paint();
        window.requestAnimationFrame(frameTimer);
    } 


    function createSaveDiv(pdiv) {
        var div=document.createElement('div');
        div.id='divSaved';
        pdiv.appendChild(div);
    }


    function init() {
        divContainer=document.getElementById('content');
        toolBarView.init(document.getElementById('toolbar'));
        editBarView.init(document.getElementById('editbar'));
        hidService.init(divContainer);
        animService.init();
        meshService.init();
        canvasView.init(divContainer,function() {
            onresize();
        });
    }


    function getLinesOff() {
        return linesOff;
    }

    return {
        init : init,
        getLinesOff : getLinesOff,
        onresize : onresize
    };

})();

