var toolBarView = (function() {

    var divContainer;

    var isGrid=false;
    var isDrawLines=false;
    var isDarkMode=true;
    var isWheelRotate=false;
    var isWheelOpacity=false;
    var isTurned=false;

    var isAddSection=false;
    var isSelectSection=false;
    var isEditSection=false;
    var isEditDestination=false;
    var isAvatarVisible=false;
    var isConnectSection=false;

    var isSaveInProgress=false;
    var isLoadInProgress=false;
    var isSchedEditorVisible=false;

    var addGroup=['btnClrSel','btnCreateSection','btnCreateSignalSection','btnUndo'];

    function setClock(y,mon,d,h,min,s) {
        document.getElementById('digiclockdate').innerHTML=new Date(y,mon,d).toDateString();
        var sTime='';
        if (h < 10) sTime+='0';
        sTime+=h+':';
        if (min < 10) sTime+='0';
        sTime+=min+':';
        if (s < 10) sTime+='0';
        sTime+=s;
        document.getElementById('digiclocktime').innerHTML=sTime;
    }
    
    function createClock() {
        var btn=util.adiv(divContainer,'digiclock');
        util.adivhtml(btn,'digiclockdate','','May 3rd, 2020');
        util.adivhtml(btn,'digiclocktime','digiclocknum','04:00:00');
    }

    function createIdPane() {
        var btn=util.adiv(divContainer,'idpane');
        util.adivhtml(btn,'idtitle','','name');
        var inp=document.createElement('input');
        inp.id='inpName';
        btn.appendChild(inp);
        inp.readOnly=true;
        var name=localStorage.getItem('avatarName');
        inp.value=((name === undefined) || (name === null) ? '' : name);
    }

    function createPwdPane() {
        var btn=util.adiv(divContainer,'idpane');
        util.adivhtml(btn,'idtitle','','password');
        var inp=document.createElement('input');
        inp.id='inpName';
        btn.appendChild(inp);
        inp.readOnly=true;
        var name=localStorage.getItem('avatarName');
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


    function switchGrid() {
        isGrid=!isGrid;
        showIndicators();
        canvasView.requestRepaint();
    }

    function switchTurn() {
        isTurned=!isTurned;
        meshService.turn();
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
        showIndicator('btnTurn',isTurned);
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


    function init(div) {
        divContainer=div;



//        createClock();
        createIdPane();
//        createPwdPane();
        createButton('btnLogin','New',meshService.newMesh);
        createLoadButton('inpUpload',meshService.load,'Load');
        createLoadButton('inpUploadX3d',meshService.loadX3d,'Ld x3d');
        createButton('btnSave','Save',meshService.saveToFile);
        createButton('btnLoad','Export',meshService.toImage);

        createToggleButton('btnGrid','Grid',switchGrid);
//        createToggleButton('btnDark','Dark',switchDarkMode);
        createToggleButton('btnRotate','Rotate',switchRotate);
        createToggleButton('btnOpacity','Opacity',switchOpacity);
        createToggleButton('btnLines','Lines',switchLines);

        createButton('btnLoad','Fit',meshView.fitToView);
        createToggleButton('btnTurn','Turn',switchTurn);


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
        setClock : setClock,
        init: init
    };

})();
