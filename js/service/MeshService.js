var meshService = (function() {

    var mesh={};

    function load(pstr) {
        mesh=JSON.parse(pstr);
        localStorage.mesh=pstr;
        if (mesh.name !== undefined) document.getElementById('inpName').value=mesh.name;
        meshView.fitToView();
        canvasView.requestRepaint();
    }


    function loadX3d(str) {
        var mag=1000;
        if (str !== null) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(str,"text/xml");

            var indexedFaceSet=xmlDoc.getElementsByTagName("IndexedFaceSet")[0];
            var sColorIndex=indexedFaceSet.getAttribute('colorIndex').trim().split(/\s+/);
            var sCoordIndex=indexedFaceSet.getAttribute('coordIndex').trim().split(/\s+/);

            var coordinate=xmlDoc.getElementsByTagName("Coordinate")[0];
            var sPoint=coordinate.getAttribute('point').trim().split(/\s+/);

            var color=xmlDoc.getElementsByTagName("Color")[0];
            var sColor=color.getAttribute('color').trim().split(/\s+/);

            var x3dobj={cp:{x:0,y:0},name: "x3d",faces:[]};

            for(var i=0;i < sCoordIndex.length/4;i++) {
                var cBase=parseInt(sColorIndex[i])*3;
                var col={r:parseInt(parseFloat(sColor[cBase])*255),g:parseInt(parseFloat(sColor[cBase+1])*255),b:parseInt(parseFloat(sColor[cBase+2])*255),a:1};
                console.log(col);
                var face={vertices:[],color :col};
                var idxs=[parseInt(sCoordIndex[i*4]),parseInt(sCoordIndex[(i*4)+1]),parseInt(sCoordIndex[(i*4)+2])];
                for(var j=0;j < 3;j++) {
                    face.vertices.push({
                        x:parseFloat(sPoint[(idxs[j]*3)])*mag,
                        y:parseFloat(sPoint[(idxs[j]*3)+1])*mag,
                        z:parseFloat(sPoint[(idxs[j]*3)+2])*mag});
                }
                face.id=i;
                face.m=i;
                x3dobj.faces.push(face);
            }
            mesh=x3dobj;
        }
        if (mesh !== null) {
            if (mesh.name !== undefined) document.getElementById('inpName').value=mesh.name;
        }
        meshView.fitToView();
        canvasView.requestRepaint();
    }

    function newMesh() {
        mesh={faces:[],cp:{x:0,y:0}};
        document.getElementById('inpName').value='New';
        localStorage.mesh=JSON.stringify(mesh);
        canvasView.requestRepaint();
    }

    function save() {
        localStorage.mesh=JSON.stringify(mesh);
    }

    function init() {
        mesh=JSON.parse(localStorage.mesh);
    }

    function getMesh() {
        return mesh;
    }

    function turn() {
        for(var i=0;i < mesh.faces.length;i++) {
            var face=mesh.faces[i];
            for(var j=0;j < face.vertices.length;j++) {
                var vert=face.vertices[j];
                vert.z*=-1;
            }
        }
    }

    function saveToFile() {
        var name=document.getElementById('inpName').value;
        mesh.name=name;
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(mesh)], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = mesh.name+'.json';
        a.click();
    }


    function getObjDims(ly,obj) {
        var cp={x: 0,y: 0};
        var tl=null;
        var br={x:0,y:0};
        for(var i=0;i < 360;i++) {
            for(var j=0;j < obj.faces.length;j++) {
                var face=obj.faces[j];
                for(var k=0;k < face.vertices.length;k++) {
                    var vtx=face.vertices[k];
                    var xyz={x: (vtx.x)-obj.cp.x,y:(vtx.y)-obj.cp.y,z:vtx.z};
                    var sp=gui.getAbsXYZ(ly,xyz,cp,i);
                    if (tl === null) tl={x: sp.x,y:sp.y};
                    else {
                        if (tl.x > sp.x) tl.x=sp.x;
                        if (tl.y > sp.y) tl.y=sp.y;
                    }
                    if (br.x < sp.x) br.x=sp.x;
                    if (br.y < sp.y) br.y=sp.y;
                }
            }
        }
        var tw=(br.x-tl.x);
        var th=(br.y-tl.y);
        var tx=-tl.x;
        var ty=-tl.y;
        return {tl : tl,br : br,tw : tw+1,th : th+1,tx : tx,ty : ty};
    }


    function createImage(n,mag) {
        var obj=mesh;
        if (obj !== undefined) {
            var ly='imgcanvas';
            gui.addLayer(ly,{fldh:0.5,fldw:1,w:0,h:0,mag:1,mx:0,my:0,mode:0,canvas : null,ctx : null,container : document.getElementById('content'),hidden: true});
            var layer=gui.getLayer(ly);
            layer.mag=1/mag;
            var dims=getObjDims(ly,obj);
            var xcnt=18;
            var ycnt=(~~(n/18));
            var ww=(n === 1 ? dims.tw : (dims.tw)*xcnt);
            var hh=(n === 1 ? dims.th : (dims.th)*ycnt);
            gui.reCreateCanvas(ly,{w:ww*(mag*2),h:(hh*mag*2)+52});
            if (n === 1) {
                var sx=0;
                var sy=0;
                var m=gui.getInvXY(ly,{x:sx+dims.tx,y:sy+dims.ty});
                drawObject(ly,obj,m,90);
            } else {
                var dd=~~(360/n);
                var ddeg=0;
                for(var i=0;i < ycnt;i++) {
                    for(var j=0;j < xcnt;j++) {
                        var sx=(j*dims.tw);
                        var sy=((i+1)*dims.th);
                        var m=gui.getInvXY(ly,{x:sx+dims.tx,y:sy-dims.ty});
                        var ctx=layer.ctx;
                        ctx.strokeStyle='#DD0000';
                        meshView.paintMesh(ly,obj,m,ddeg);
                        ddeg+=dd;
                    }
                }
                var txt="Image size:"+dims.tw+' x '+dims.th+' CP '+dims.tx+':'+(dims.th-dims.ty)+' n:'+n+' mag:'+mag;
//                gui.drawText(ly,gui.getInvXY(ly,{x:10,y:hh+((dims.th/2))+1}),txt,'#800000',0,14);
                console.log(txt);
                gui.drawText(ly,txt,gui.getInvXY(ly,{x:100,y:hh+((dims.th/2))+1}),'#800000',null,44,0);

//                ctx.fillStyle='#800000';
//                ctx.font="14px Arial";
//                ctx.fillText("Image size:"+dims.tw+' x '+dims.th+' CP '+dims.tx+':'+dims.ty+' n:'+n+' mag:'+mag ,10,hh);
            }

            var image=gui.canvasToImage(ly);
//            window.open(image,'_blank');



            var win = window.open();
            win.document.write('<iframe background="#000000" src="' + image  + '" frameborder="0" style="background-color: #000000; border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        }


    }

    function toImage() {
        createImage(90,3);
    }


    function get2DDim(deg) {
        var tl;
        var br;
        var fxys=[];
        for(var i=0;i < mesh.faces.length;i++) {
            var face=mesh.faces[i];
            for(var j=0;j < face.vertices.length;j++) {
                var vert=face.vertices[j];
                var p=coord.flatXYZ(vert,{x:0,y:0},deg);
                var x=(p.x+p.y)*2;
                var y=(p.x-p.y)+(vert.z*2);

                var fxy={x:x,y:y};
                fxys.push(fxy);
                if (tl === undefined) tl={x:fxy.x,y:fxy.y};
                else {
                    if (tl.x > fxy.x) tl.x=fxy.x;
                    if (tl.y > fxy.y) tl.y=fxy.y;
                }
                if (br === undefined) br={x:fxy.x,y:fxy.y};
                else {
                    if (br.x < fxy.x) br.x=fxy.x;
                    if (br.y < fxy.y) br.y=fxy.y;

                }
            }
        }
        return {topLeft:tl,rightBottom:br,fxys:fxys};
    }

    function addFace(face) {
        mesh.faces.push(face);
        save();
    }

    function removeFace(face) {
        var idx=mesh.faces.indexOf(face);
        mesh.faces.splice(idx,1);
        save();
    }

    return {
        init: init,
        saveToFile : saveToFile,
        get2DDim : get2DDim,
        toImage: toImage,
        mesh: getMesh,
        addFace : addFace,
        removeFace : removeFace,
        newMesh: newMesh,
        turn: turn,
        save: save,
        loadX3d : loadX3d,
        load: load
    };

})();
