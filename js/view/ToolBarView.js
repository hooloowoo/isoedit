var toolBarView = (function() {

    var divContainer;

    var isGrid=false;
    var isDrawLines=false;
    var isDarkMode=true;
    var isWheelRotate=false;
    var isWheelOpacity=false;
    var isVerticalTurned=false;
    var isHorizontalTurned=false;

    
    function createIdPane() {
        var btn=util.adiv(divContainer,'idpane');
        util.adivhtml(btn,'idtitle','','name');
        var inp=document.createElement('input');
        inp.id='inpName';
        inp.oninput=function (e) {
            var name=e.target.value;
            meshService.setName(name);
        };
        btn.appendChild(inp);
        var name=meshService.mesh().name;
        inp.value=((name === undefined) || (name === null) ? '' : name);
    }


    function createToggleButton(id,text,fn) {
        var btn=util.adiv(divContainer,id,'togglebuttonlink');
        util.adiv(btn,'ind_'+id,'toggleindicator');
        util.adivhtml(btn,'','buttontext',text);
        btn.onclick=fn;
    }

    function createButton(id,text,fn) {
        var btn=util.adiv(divContainer,id,'togglebuttonlink');
        util.adivhtml(btn,'','buttontext',text);
        btn.onclick=fn;
    }

    function createAButton(id,text,fn) {
        var a=document.createElement('a');
        a.id=id;
        a.className='togglebuttonlink';
        divContainer.appendChild(a);

        var atxt=document.createElement('a');
        atxt.className='abuttontext';
        a.appendChild(atxt);
        atxt.innerHTML=text;
        a.onclick=fn;
        atxt.onclick=fn;
        a.download='new.png';
        atxt.download='new.png';
    }

    function switchGrid() {
        isGrid=!isGrid;
        showIndicators();
        canvasView.requestRepaint();
    }

    function turnVertical() {
        isVerticalTurned=!isVerticalTurned;
        meshService.turnVertical();
        showIndicators();
        canvasView.requestRepaint();
    }

    function turnHorizontal() {
        isHorizontalTurned=!isHorizontalTurned;
        meshService.turnHorizontal();
        showIndicators();
        canvasView.requestRepaint();
    }

    function switchLines() {
        isDrawLines=!isDrawLines;
        showIndicators();
        canvasView.requestRepaint();
    }

    function switchDarkMode() {
        isDarkMode=!isDarkMode;
        showIndicators();
        canvasView.requestRepaint();
    }

    function switchRotate() {
        isWheelRotate=!isWheelRotate;
        isWheelOpacity=false;
        showIndicators();
        canvasView.requestRepaint();
    }

    function switchOpacity() {
        isWheelOpacity=!isWheelOpacity;
        isWheelRotate=false;
        showIndicators();
        canvasView.requestRepaint();
    }

    function showIndicator(id,flag) {
        var div=document.getElementById('ind_'+id);
        if (div !== null) {
            div.style.backgroundColor = (flag ? '#80FFFF' : '#505050');
        }
    }

    function showIndicators() {
        showIndicator('btnGrid',isGrid);
        showIndicator('btnTurnH',isHorizontalTurned);
        showIndicator('btnTurnV',isVerticalTurned);
        showIndicator('btnLines',isDrawLines);
        showIndicator('btnDark',isDarkMode);
        showIndicator('btnRotate',isWheelRotate);
        showIndicator('btnOpacity',isWheelOpacity);

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


    function createLoadButton(id,fn,label) {
        var idiv=util.adiv(divContainer,'','upload');
        var inp=document.createElement('input');
        inp.type='file';
        inp.id=id;
        inp.addEventListener('change',
            function(e) {
                if (e.target.files.length > 0) {
                    var file = e.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function(ee) {
                        if (ee.target.readyState == FileReader.DONE) {
                            fn(ee.target.result);
                            canvasView.requestRepaint();
                        }
                    };
                    reader.readAsText(file);
                }
            }
            , false);
        idiv.appendChild(inp);
        var lbl=document.createElement('label');
        lbl.setAttribute('for',id);
        lbl.innerHTML=label;
        idiv.appendChild(lbl);

    }

    function createMagInput() {
        var magFrame=util.adiv(divContainer,'magpane');
        var pframe=util.adiv(magFrame,'framemag','mag-frame');
        util.adivhtml(pframe,'idmag','coord-title','mag');
        var inpx=document.createElement('input');
        inpx.id='inpMag';
        inpx.className='inpCoord';
        pframe.appendChild(inpx);
        inpx.value='1';
    }


    function doExportOne(e) {
        var m = parseFloat(document.getElementById('inpMag').value);
        var img = meshService.toSpriteImage(1, m);
        e.target.download=document.getElementById('inpName').value;
        e.target.href = img;
    }

    function doExport(e) {
        var m = parseFloat(document.getElementById('inpMag').value);
        var img = meshService.toSpriteImage(90, m);
        e.target.download=document.getElementById('inpName').value;
        e.target.href = img;
    }

    function init(div) {
        divContainer=div;
        createIdPane();
        createButton('btnLogin','New',meshService.newMesh);
        createLoadButton('inpUpload',meshService.load,'Load');
        createLoadButton('inpUploadX3d',meshService.loadX3d,'Ld x3d');
        createButton('btnSave','Save',meshService.saveToFile);
        createMagInput();
        createAButton('btnExport','Export Sprite',doExport);
        createAButton('btnExportOne','Export One',doExportOne);
        createToggleButton('btnGrid','Grid',switchGrid);
        createToggleButton('btnRotate','Rotate',switchRotate);
        createToggleButton('btnOpacity','Opacity',switchOpacity);
        createToggleButton('btnLines','Lines',switchLines);
        createButton('btnLoad','Fit',meshView.fitToView);
        createToggleButton('btnTurnV','V Turn',turnVertical);
        createToggleButton('btnTurnH','H Turn',turnHorizontal);
        update();
    }

    function getIsGrid() {
        return isGrid;
    }


    function getIsDrawLines() {
        return isDrawLines;
    }

    function getIsDarkMode() {
        return isDarkMode;
    }

    function getIsWheelRotate() {
        return isWheelRotate;
    }
    function getIsWheelOpacity() {
        return isWheelOpacity;
    }

    return {
        isGrid : getIsGrid,
        isDrawLines: getIsDrawLines,
        isDarkMode: getIsDarkMode,
        isWheelRotate: getIsWheelRotate,
        isWheelOpacity: getIsWheelOpacity,
        init: init
    };

})();
