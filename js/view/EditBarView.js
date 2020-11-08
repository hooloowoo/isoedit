var editBarView = (function() {

    var divContainer;
    var isSquare=true;
    var isColorLocked=false;

    var faceFrame=null;
    var actFace;

    function onCoordChange(e) {
        if ((actFace !== undefined) && (e.target.id.indexOf('inpp') === 0)) {
            var val=parseInt(e.target.value);
            var idx=parseInt(e.target.id.substr(4,1));
            var c=e.target.id.substr(5,1);
            console.log(idx,c,val);
            if (c === 'X') actFace.vertices[idx].x=val;
            if (c === 'Y') actFace.vertices[idx].y=val;
            if (c === 'Z') actFace.vertices[idx].z=val;
            meshService.save();
            canvasView.requestRepaint();
        }
    }

    function createCoord(pdiv,id) {
        var pframe=util.adiv(pdiv,'frame'+id,'point-frame');
        util.adivhtml(pframe,'id'+id,'coord-title',id);
        var inpx=document.createElement('input');
        inpx.id='inp'+id+'X';
        inpx.className='inpCoord';
        inpx.oninput=onCoordChange;
        pframe.appendChild(inpx);
        inpx.value='';

        var inpsep=document.createElement('input');
        inpsep.style.left='2.4em';
        inpsep.readOnly=true;
        inpsep.style.width='0.5em';
        inpsep.className='inpCoord';
        pframe.appendChild(inpsep);
        inpsep.value=':';

        var inpy=document.createElement('input');
        inpy.id='inp'+id+'Y';
        inpy.style.left='2.8em';
        inpy.className='inpCoord';
        inpy.oninput=onCoordChange;
        pframe.appendChild(inpy);
        inpy.value='';

        var inpsep=document.createElement('input');
        inpsep.style.left='5.2em';
        inpsep.readOnly=true;
        inpsep.style.width='0.5em';
        inpsep.className='inpCoord';
        pframe.appendChild(inpsep);
        inpsep.value=':';

        var inpz=document.createElement('input');
        inpz.id='inp'+id+'Z';
        inpz.style.left='5.8em';
        inpz.className='inpCoord';
        inpz.oninput=onCoordChange;
        pframe.appendChild(inpz);
        inpz.value='';
    }

    function createFaceFrame() {
        faceFrame=util.adiv(divContainer,'facepane');
        createCoord(faceFrame,'p0');
        createCoord(faceFrame,'p1');
        createCoord(faceFrame,'p2');
        createCoord(faceFrame,'p3');
    }

    function createMoveFrame() {
        var moveFrame=util.adiv(divContainer,'movepane');
        createCoord(moveFrame,'move');
        document.getElementById('inpmoveX').value='0';
        document.getElementById('inpmoveY').value='0';
        document.getElementById('inpmoveZ').value='0';
    }


    function createToggleButton(id,text,fn) {
        var btn=util.adiv(divContainer,id,'edit-togglebuttonlink');
        util.adiv(btn,'ind_'+id,'edit-toggleindicator');
        util.adivhtml(btn,'','edit-buttontext',text);
        btn.onclick=fn;
    }

    function createButton(id,text,fn) {
        var btn=util.adiv(divContainer,id,'edit-togglebuttonlink');
        util.adivhtml(btn,'','edit-buttontext',text);
        btn.onclick=fn;
    }


    function switchSquare() {
        isSquare=!isSquare;
        setSquare(isSquare);
    }

    function switchLockColor() {
        isColorLocked=!isColorLocked;
        showIndicators();
    }

    function setSquare(val) {
        isSquare=val;
        if (isSquare) {
            document.getElementById('framep3').style.visibility='visible';
//            document.getElementById('framep3').style.display='inline-block';
        } else {
            document.getElementById('framep3').style.visibility='hidden';
//            document.getElementById('framep3').style.display='none';

        }

        showIndicators();
//        canvasView.requestRepaint();
    }


    function showIndicator(id,flag) {
        var div=document.getElementById('ind_'+id);
        if (div !== null) {
            div.style.backgroundColor = (flag ? '#80FFFF' : '#505050');
        }
    }

    function showIndicators() {
        showIndicator('btnSquare',isSquare);
        showIndicator('btnLockColor',isColorLocked);

    }

    function showGroup(grp,shw) {
        for(var i=0;i < grp.length;i++) {
            var div=document.getElementById(grp[i]);
            if (shw) {
                div.style.visibility='visible';
                div.style.display='';
            } else {
                div.style.visibility='hidden';
                div.style.display='none';
            }
        }
    }


    function isVisible() {
        return true;
    }

    function update() {
        for(var i=0;i < divContainer.children.length;i++) {
            var child=divContainer.children[i];
            if (child.className === 'togglebuttonlink') {
                if (isVisible(child.id)) {
                    child.style.visibility='visible';
                    child.style.display='';
                } else {
                    child.style.visibility='hidden';
                    child.style.display='none';
                }
            }
        }
        showIndicators();
    }


    function createColorButton(id,fn,label) {
        var idiv=util.adiv(divContainer,'','edit-togglebuttonlink');
        var inp=document.createElement('input');
        inp.type='color';
        inp.id=id;
        inp.addEventListener('change',
            function(e) {
                if (actFace !== undefined) {
                    var rgb=gui.hexToRgb(e.target.value);
                    actFace.color=rgb;
                }
            }
            , false);
        idiv.appendChild(inp);
        var lbl=document.createElement('label');
        lbl.setAttribute('for',id);
        lbl.innerHTML=label;
        idiv.appendChild(lbl);

    }

    function cpFace() {
        if (actFace !== undefined) {
            var nFace = JSON.parse(JSON.stringify(actFace));
            actFace = nFace;
            meshService.addFace(actFace);
            setFace(actFace);
            canvasView.requestRepaint();
        }
    }

    function delFace() {
        meshService.removeFace(actFace);
        actFace=undefined;
        for(var i=0;i < 4;i++) {
            document.getElementById('inpp'+i+'X').value='';
            document.getElementById('inpp'+i+'Y').value='';
            document.getElementById('inpp'+i+'Z').value='';
        }
        canvasView.requestRepaint();
    }

    function moveFace() {
        if (actFace !== undefined) {
            for(var i=0;i < actFace.vertices.length;i++) {
                var vert=actFace.vertices[i];
                vert.x+=parseInt(document.getElementById('inpmoveX').value);
                vert.y+=parseInt(document.getElementById('inpmoveY').value);
                vert.z+=parseInt(document.getElementById('inpmoveZ').value);
                console.log(vert);
            }
        }
        canvasView.requestRepaint();
    }

    function delTexture() {
        if (actFace !== undefined) {
            actFace.texture=undefined;
            meshService.save();
            canvasView.requestRepaint();
        }
    }

    function newFace() {
        var inp=document.getElementById('btnColor');

        actFace={color: gui.hexToRgb(inp.value),vertices:[
            {x:-100,y:-100,z:0}, {x:100,y:-100,z:0},{x:100,y:100,z:0}]};
        if (isSquare) {
            actFace.vertices.push({x:-100,y:100,z:0});
        }
        meshService.addFace(actFace);
        setFace(actFace);
        canvasView.requestRepaint();
    }

    function createTextureButton(id) {
        var idiv=util.adiv(divContainer,'','edit-upload');
        var inp=document.createElement('input');
        inp.type='file';
        inp.id='btnTexture';
        inp.addEventListener('change',
            function(e) {
                if (actFace !== undefined) {
                    if (this.files[0]) {
                        var reader  = new FileReader();
                        reader.addEventListener("load", function () {
                            actFace.texture=reader.result;
                            meshService.save();
                            canvasView.requestRepaint();
                        }, false);
                        reader.readAsDataURL(this.files[0]);
                    }
                }
            }
            , false);
        idiv.appendChild(inp);
        var lbl=document.createElement('label');
        lbl.setAttribute('for','btnTexture');
        lbl.innerHTML='Texture';
        idiv.appendChild(lbl);

    }
    
    function doMagnify() {
        var mesh=meshService.mesh();
        var m=parseFloat(document.getElementById('inpMag').value);
        for(var i=0;i < mesh.faces.length;i++) {
            var face=mesh.faces[i];
            for(var j=0;j < face.vertices.length;j++) {
                var vert=face.vertices[j];
                vert.x*=m;
                vert.y*=m;
                vert.z*=m;
            }
        }
        meshService.save();
        canvasView.requestRepaint();
    }

    function init(div) {
        divContainer=div;
        createFaceFrame();
        createToggleButton('btnSquare','Square',switchSquare);
        createColorButton('btnColor',switchSquare,'Color');
        createToggleButton('btnLockColor','Lock Color',switchLockColor);

        createButton('btnNew','New',newFace);
        createButton('btnCp','Copy',cpFace);
        createButton('btnDel','Delete',delFace);

        createMoveFrame();
        createButton('btnMove','Move',moveFace);
        createTextureButton();
        createButton('btnDelTexture','Del',delTexture);

        update();
    }

    function setFace(face) {
        actFace=face;
        for(var i=0;i < face.vertices.length;i++) {
            var vert=face.vertices[i];
            document.getElementById('inpp'+i+'X').value=vert.x;
            document.getElementById('inpp'+i+'Y').value=vert.y;
            document.getElementById('inpp'+i+'Z').value=vert.z;
        }
        if (isColorLocked) {
            if (actFace !== undefined) {
                var inp=document.getElementById('btnColor');
                actFace.color=gui.hexToRgb(inp.value);
            }
        }
        else document.getElementById('btnColor').value=gui.rgbToHex(face.color.r,face.color.g,face.color.b);
        setSquare(face.vertices.length == 4);
    }

    return {
        setFace: setFace,
        init: init
    };

})();
