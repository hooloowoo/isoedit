var mEditorPane=(function () {

    var obj;
    var faceList;
    var divPane;
    var faceEditor
    var selectedFaceId=-1;

    var clipBrd={};

    var pinnedVertices=[];

    function setObject(o) {
        obj=o;
        if (obj !== null) {
            if (obj.faces !== undefined) {
                for(var i=0;i < obj.faces.length;i++) {
                    var face=obj.faces[i];
                    var facerow=util.adiv(faceList,'face_'+i,'facerow');
                    facerow.innerHTML=''+i;
                }
            }
        }
    }

    function vxInp(id,val,nkup) {
        var inp=document.createElement('input');
        inp.className='vxinp';
        inp.value=val;
        inp.id=id;
        if (!nkup) {
            inp.onkeyup=function(e) {
                var iid=e.target.id;
                var par=iid.substring(2,3);
                var nr=parseInt(iid.substring(4));
                obj.faces[selectedFaceId].vertices[nr][par]=parseFloat(e.target.value);
                mImggen.paint();
            }
        }
        return inp;
    }

    function addVx(pdiv,v,i,nkup) {
        var vxrow=util.adiv(pdiv,'','vxrow');
        util.adivhtml(vxrow,'','vxlabel','x');
        util.adiv(vxrow,'','vxidiv').appendChild(vxInp('vxx_'+i,v.x,nkup));
        util.adivhtml(vxrow,'','vxlabel','y');
        util.adiv(vxrow,'','vxidiv').appendChild(vxInp('vxy_'+i,v.y,nkup));
        util.adivhtml(vxrow,'','vxlabel','z');
        util.adiv(vxrow,'','vxidiv').appendChild(vxInp('vxz_'+i,v.z,nkup));
    }


    function fillFace(face) {
        document.getElementById('inpFaceColor').value=gui.rgbToHex(face.color.r,face.color.g,face.color.b);
        var divV=document.getElementById('vertices');
        divV.innerHTML='';
        for(var i=0;i < face.vertices.length;i++) {
            var v=face.vertices[i];
            addVx(divV,v,i);
        }        
    }


    function selectFace(i) {
        if (selectedFaceId !== -1) document.getElementById('face_'+selectedFaceId).style.backgroundColor='';
        if (i === selectedFaceId) {
            document.getElementById('face_'+selectedFaceId).style.backgroundColor='';
            document.getElementById('vertices').innerHTML='';
            selectedFaceId=-1;
        } else {
            selectedFaceId=i;
            fillFace(obj.faces[i]);
        }
    }

    function pinVertices() {
        var face=obj.faces[selectedFaceId];
        var ret=[];
        for(var i=0;i < face.vertices.length;i++) {
            var v=face.vertices[i];
            ret.push({x:v.x,y:v.y,z:v.z});
        }        
        pinnedVertices=ret;
        var div=document.getElementById('divSaved');
        var dres='';
        for(var i=0;i < pinnedVertices.length;i++) {
            var v=pinnedVertices[i];
            dres+='x:'+v.x+',y:'+v.y+',z:'+v.z+'<br>';
        }
        div.innerHTML=dres;
    }

    function copyVertices() {
        var face=obj.faces[selectedFaceId];
        clipBrd=JSON.stringify(face);
    }

    function pasteVertices() {
        obj.faces[selectedFaceId]=JSON.parse(clipBrd);
        fillFace(obj.faces[selectedFaceId]);
    }


    function copyAndCreatVertices() {
        copyVertices();
        addFace(JSON.parse(clipBrd).vertices.length);
        var faceid=obj.faces.length-1;
        selectFace(faceid);
        pasteVertices();
        mImggen.highlightFace(faceid);
    }

    function moveFace() {
        var face=obj.faces[selectedFaceId];
        var mvx=parseInt(document.getElementById('vxx_mv').value);
        var mvy=parseInt(document.getElementById('vxy_mv').value);
        var mvz=parseInt(document.getElementById('vxz_mv').value);
        for(var i=0;i < face.vertices.length;i++) {
            var v=face.vertices[i];
            v.x+=mvx;
            v.y+=mvy;
            v.z+=mvz;
        }
        fillFace(obj.faces[selectedFaceId]);
    }


    function removeFace() {
        if (selectedFaceId !== -1) {
            mImggen.removeFaceById(selectedFaceId);
            selectedFaceId=-1;
            init(mImggen.getObject());
        }
    }


    function addFace(typ) {
        mImggen.addFace(typ);
        init(mImggen.getObject());
    }



    function init(o) {
        var pdiv=document.getElementById('content');
        var ePane=document.getElementById('editorpane');
        if (ePane !== null) pdiv.removeChild(ePane);


        divPane=util.adiv(pdiv,'editorpane','');
        util.adivhtml(divPane,'','separatorlabel','Face');
        faceEditor=util.adiv(divPane,'faceeditor','');

        var ccDiv=util.adiv(faceEditor,'','separatorlabel');
        var ccInp=document.createElement('input');
        ccInp.id='inpFaceColor';
        ccInp.type='color';
        ccInp.onchange=function(e) {
            if (selectedFaceId !== -1) {
                obj.faces[selectedFaceId].color=gui.hexToRgb(e.target.value);
                mImggen.paint();
            }
        };
        faceEditor.appendChild(ccInp);

        util.adivhtml(faceEditor,'','separatorlabel','Vertices');
        var divV=util.adiv(faceEditor,'vertices','');

        var divPin=util.adiv(faceEditor,'','separatorlabel');
        

        var btnPin=document.createElement('button');
        btnPin.innerHTML='Copy';
        btnPin.onclick=function() {copyVertices();}
        divPin.appendChild(btnPin);


        var btnPin=document.createElement('button');
        btnPin.innerHTML='Paste';
        btnPin.onclick=function() {pasteVertices();}
        divPin.appendChild(btnPin);

        var btnPin=document.createElement('button');
        btnPin.innerHTML='Crea';
        btnPin.onclick=function() {copyAndCreatVertices();}
        divPin.appendChild(btnPin);

        var btnPin=document.createElement('button');
        btnPin.innerHTML='Pin';
        btnPin.onclick=function() {pinVertices();}
        divPin.appendChild(btnPin);


        var btnDel=document.createElement('button');
        btnDel.innerHTML='del';
        btnDel.onclick=function() {removeFace();}
        divPin.appendChild(btnDel);

        var btnAddTri=document.createElement('button');
        btnAddTri.innerHTML='Tri';
        btnAddTri.onclick=function() {addFace(3);}
        divPin.appendChild(btnAddTri);

        var btnAddSq=document.createElement('button');
        btnAddSq.innerHTML='Sq';
        btnAddSq.onclick=function() {addFace(4);}
        divPin.appendChild(btnAddSq);


        addVx(divPin,{x:0,y:0,z:0},'mv',true);

        var btnMv=document.createElement('button');
        btnMv.innerHTML='Mv';
        btnMv.onclick=function() {moveFace();}
        divPin.appendChild(btnMv);


        util.adivhtml(divPin,'','','Texture:');
        var inpTexture=document.createElement('input');
        inpTexture.type='file';
        inpTexture.onchange=function() {
            if (selectedFaceId !== -1) {
                if (this.files[0]) {
                    var reader  = new FileReader();
                    reader.addEventListener("load", function () {
                        obj.faces[selectedFaceId].texture=reader.result;
                        mImggen.paint();
                    }, false);
                    reader.readAsDataURL(this.files[0]);
                }
            }
        };
        divPin.appendChild(inpTexture);

        var btnDelTexture=document.createElement('button');
        btnDelTexture.innerHTML='Del';
        btnDelTexture.onclick=function() {
            if (selectedFaceId !== -1) {
                delete obj.faces[selectedFaceId].texture;
                mImggen.paint();
            }
        };
        divPin.appendChild(btnDelTexture);


        util.adivhtml(divPane,'','separatorlabel','Faces');
        faceList=util.adiv(divPane,'faceList','');
        faceList.onclick=function(e) {
            if (e.target.id.startsWith('face_')) {
                var faceid=parseInt(e.target.id.substring(5));
                e.target.style.backgroundColor='#FF8080';
                selectFace(faceid);
                mImggen.highlightFace(faceid);
            }
        }
        faceList.onmouseover=function(e) {
            if (selectedFaceId === -1) {
                mImggen.highlightFace(parseInt(e.target.id.substring(5)));
            }
        }
        if (o !== undefined) setObject(o);
        onResize();
    }


    function onResize() {
        var tw=(window.innerWidth/4)-16;
        if (tw < 300) tw=300;
        var th=window.innerHeight-16;
        divPane.style.width=''+tw+'px';
//        divPane.style.height=''+th+'px';
        divPane.style.left=''+(window.innerWidth-16-tw)+'px';
        faceList.style.width=''+(tw-18)+'px';
//          faceList.style.height=''+(th-18)+'px';
//        faceList.style.left=''+(window.innerWidth-16-tw)+'px';
        var divSaved=document.getElementById('divSaved');
        divSaved.style.left=''+(window.innerWidth-216-tw)+'px';

    }

    function clear() {
        divPane.innerHTML='';
    }

    return {
        clear : clear,
        onResize :  onResize,
        init : init
    };
    
})();

