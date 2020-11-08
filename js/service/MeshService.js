var meshService = (function() {

    var mesh={"cp":{"x":0,"y":0},"faces":[{"vertices":[{"x":-45,"y":-20,"z":0},{"x":45,"y":-20,"z":0},{"x":45,"y":20,"z":0},{"x":-45,"y":20,"z":0}],"color":{"r":160,"g":160,"b":160,"a":"0.9"},"m":53851.648071345044,"id":0,"tpos":[0,0,0.1,0,0.1,0.1,0,0.1]},{"vertices":[{"x":-45,"y":-20,"z":0},{"x":45,"y":-20,"z":0},{"x":45,"y":-30,"z":10},{"x":-45,"y":-30,"z":10}],"color":{"r":160,"g":160,"b":160,"a":"0.9"},"m":53834.9389337445,"id":1,"tpos":[0,0,0.1,0,0.1,0.1,0,0.1]},{"vertices":[{"x":-45,"y":20,"z":0},{"x":45,"y":20,"z":0},{"x":45,"y":30,"z":10},{"x":-45,"y":30,"z":10}],"color":{"r":160,"g":160,"b":160,"a":"0.9"},"m":53872.07671883459,"id":2,"tpos":[0,0,0.1,0,0.1,0.1,0,0.1]},{"vertices":[{"x":-45,"y":30,"z":10},{"x":45,"y":30,"z":10},{"x":45,"y":30,"z":70},{"x":-45,"y":30,"z":70}],"color":{"r":250,"g":250,"b":250,"a":"0.9"},"m":53888.797537150516,"id":3},{"vertices":[{"x":-45,"y":-30,"z":10},{"x":45,"y":-30,"z":10},{"x":45,"y":-30,"z":70},{"x":-45,"y":-30,"z":70}],"color":{"r":250,"g":250,"b":250,"a":"0.9"},"m":53844.242960598865,"id":4},{"vertices":[{"x":-45,"y":-20,"z":80},{"x":45,"y":-20,"z":80},{"x":45,"y":-30,"z":70},{"x":-45,"y":-30,"z":70}],"color":{"r":216,"g":216,"b":216,"a":"0.9"},"m":53860.9900577403,"id":5},{"vertices":[{"x":-45,"y":20,"z":80},{"x":45,"y":20,"z":80},{"x":45,"y":30,"z":70},{"x":-45,"y":30,"z":70}],"color":{"r":216,"g":216,"b":216,"a":"0.9"},"m":53898.10989264837,"id":6},{"vertices":[{"x":-45,"y":-20,"z":80},{"x":45,"y":-20,"z":80},{"x":45,"y":20,"z":80},{"x":-45,"y":20,"z":80}],"color":{"r":216,"g":216,"b":216,"a":"0.9"},"m":53881.41052348203,"id":7},{"vertices":[{"x":45,"y":-20,"z":80},{"x":57,"y":-20,"z":70},{"x":57,"y":20,"z":70},{"x":45,"y":20,"z":80}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53851.167359677536,"id":8},{"vertices":[{"x":60,"y":-30,"z":20},{"x":45,"y":-30,"z":20},{"x":45,"y":-30,"z":27},{"x":60,"y":-30,"z":27}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53808.86737797033,"id":9},{"vertices":[{"x":60,"y":-30,"z":20},{"x":67,"y":-20,"z":20},{"x":67,"y":-20,"z":27},{"x":60,"y":-30,"z":27}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53806.460666912484,"id":10},{"vertices":[{"x":67,"y":-20,"z":20},{"x":67,"y":-20,"z":27},{"x":67,"y":20,"z":27},{"x":67,"y":20,"z":20}],"color":{"r":160,"g":160,"b":160,"a":"0.9"},"m":53823.09022389926,"id":11},{"vertices":[{"x":67,"y":-20,"z":27},{"x":57,"y":-20,"z":70},{"x":57,"y":20,"z":70},{"x":67,"y":20,"z":27}],"color":{"r":64,"g":64,"b":96,"a":"0.9"},"m":53835.17619781698,"id":12},{"vertices":[{"x":60,"y":-30,"z":27},{"x":45,"y":-30,"z":27},{"x":45,"y":-30,"z":70},{"x":48,"y":-30,"z":70}],"color":{"r":64,"g":64,"b":96,"a":"0.9"},"m":53819.84487621643,"id":13},{"vertices":[{"x":45,"y":-20,"z":80},{"x":57,"y":-20,"z":70},{"x":48,"y":-30,"z":70},{"x":45,"y":-30,"z":70}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53832.91983361575,"id":14},{"vertices":[{"x":67,"y":-20,"z":27},{"x":57,"y":-20,"z":70},{"x":48,"y":-30,"z":70},{"x":60,"y":-30,"z":27}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53818.82887289541,"id":15},{"vertices":[{"x":45,"y":-20,"z":0},{"x":45,"y":20,"z":0},{"x":57,"y":20,"z":10},{"x":57,"y":-20,"z":10}],"color":{"r":160,"g":160,"b":160,"a":"0.9"},"m":53825.11148153805,"id":16},{"vertices":[{"x":57,"y":-20,"z":10},{"x":67,"y":-20,"z":20},{"x":67,"y":20,"z":20},{"x":57,"y":20,"z":10}],"color":{"r":160,"g":160,"b":160,"a":"0.9"},"m":53822.70960291762,"id":17},{"vertices":[{"x":45,"y":-20,"z":0},{"x":45,"y":-30,"z":10},{"x":52,"y":-30,"z":10},{"x":57,"y":-20,"z":10}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53808.160685090326,"id":18},{"vertices":[{"x":45,"y":-30,"z":20},{"x":45,"y":-30,"z":10},{"x":52,"y":-30,"z":10},{"x":60,"y":-30,"z":20}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53806.818111183646,"id":19},{"vertices":[{"x":52,"y":-30,"z":10},{"x":57,"y":-20,"z":10},{"x":67,"y":-20,"z":20},{"x":60,"y":-30,"z":20}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53805.80201985656,"id":20},{"vertices":[{"x":60,"y":30,"z":20},{"x":67,"y":20,"z":20},{"x":67,"y":20,"z":27},{"x":60,"y":30,"z":27}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53843.61809444087,"id":21},{"vertices":[{"x":60,"y":30,"z":20},{"x":45,"y":30,"z":20},{"x":45,"y":30,"z":27},{"x":60,"y":30,"z":27}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53853.451221811214,"id":22},{"vertices":[{"x":60,"y":30,"z":27},{"x":45,"y":30,"z":27},{"x":45,"y":30,"z":70},{"x":48,"y":30,"z":70}],"color":{"r":64,"g":64,"b":96,"a":"0.9"},"m":53864.419633929036,"id":23},{"vertices":[{"x":67,"y":20,"z":27},{"x":57,"y":20,"z":70},{"x":48,"y":30,"z":70},{"x":60,"y":30,"z":27}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53855.97776709657,"id":24},{"vertices":[{"x":45,"y":20,"z":80},{"x":57,"y":20,"z":70},{"x":48,"y":30,"z":70},{"x":45,"y":30,"z":70}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53870.05901066473,"id":25},{"vertices":[{"x":45,"y":20,"z":0},{"x":45,"y":30,"z":10},{"x":52,"y":30,"z":12},{"x":57,"y":20,"z":10}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53845.502728291984,"id":26},{"vertices":[{"x":45,"y":30,"z":20},{"x":45,"y":30,"z":10},{"x":52,"y":30,"z":12},{"x":60,"y":30,"z":20}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53851.58948907637,"id":27},{"vertices":[{"x":52,"y":30,"z":12},{"x":57,"y":20,"z":10},{"x":67,"y":20,"z":20},{"x":60,"y":30,"z":20}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53843.14576851914,"id":28},{"vertices":[{"x":-60,"y":-30,"z":27},{"x":-45,"y":-30,"z":27},{"x":-45,"y":-30,"z":70},{"x":-48,"y":-30,"z":70}],"color":{"r":64,"g":64,"b":96,"a":"0.9"},"m":53875.000719257536,"id":29},{"vertices":[{"x":-45,"y":-20,"z":80},{"x":-57,"y":-20,"z":70},{"x":-48,"y":-30,"z":70},{"x":-45,"y":-30,"z":70}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53887.22722327156,"id":30},{"vertices":[{"x":-67,"y":-20,"z":27},{"x":-57,"y":-20,"z":70},{"x":-48,"y":-30,"z":70},{"x":-60,"y":-30,"z":27}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53883.4514600726,"id":31},{"vertices":[{"x":-45,"y":-20,"z":0},{"x":-45,"y":20,"z":0},{"x":-57,"y":20,"z":10},{"x":-57,"y":-20,"z":10}],"color":{"r":160,"g":160,"b":160,"a":"0.9"},"m":53881.93227789813,"id":32},{"vertices":[{"x":-57,"y":-20,"z":10},{"x":-67,"y":-20,"z":20},{"x":-67,"y":20,"z":20},{"x":-57,"y":20,"z":10}],"color":{"r":160,"g":160,"b":160,"a":"0.9"},"m":53891.78108951308,"id":33},{"vertices":[{"x":-45,"y":-20,"z":0},{"x":-45,"y":-30,"z":10},{"x":-52,"y":-30,"z":10},{"x":-57,"y":-20,"z":10}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53863.60697458443,"id":34},{"vertices":[{"x":-45,"y":-30,"z":20},{"x":-45,"y":-30,"z":10},{"x":-52,"y":-30,"z":10},{"x":-60,"y":-30,"z":20}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53863.10124055242,"id":35},{"vertices":[{"x":-52,"y":-30,"z":10},{"x":-57,"y":-20,"z":10},{"x":-67,"y":-20,"z":20},{"x":-60,"y":-30,"z":20}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53871.55400580161,"id":36},{"vertices":[{"x":-60,"y":30,"z":20},{"x":-67,"y":20,"z":20},{"x":-67,"y":20,"z":27},{"x":-60,"y":30,"z":27}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53914.33213441487,"id":37},{"vertices":[{"x":-60,"y":30,"z":20},{"x":-45,"y":30,"z":20},{"x":-45,"y":30,"z":27},{"x":-60,"y":30,"z":27}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53911.91156414322,"id":38},{"vertices":[{"x":-60,"y":30,"z":27},{"x":-45,"y":30,"z":27},{"x":-45,"y":30,"z":70},{"x":-48,"y":30,"z":70}],"color":{"r":64,"g":64,"b":96,"a":"0.9"},"m":53919.52988018349,"id":39},{"vertices":[{"x":-67,"y":20,"z":27},{"x":-57,"y":20,"z":70},{"x":-48,"y":30,"z":70},{"x":-60,"y":30,"z":27}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53920.555832168495,"id":40},{"vertices":[{"x":-45,"y":20,"z":80},{"x":-57,"y":20,"z":70},{"x":-48,"y":30,"z":70},{"x":-45,"y":30,"z":70}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53924.32899733199,"id":41},{"vertices":[{"x":-45,"y":20,"z":0},{"x":-45,"y":30,"z":10},{"x":-52,"y":30,"z":10},{"x":-57,"y":20,"z":10}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53900.725007299305,"id":42},{"vertices":[{"x":-45,"y":30,"z":20},{"x":-45,"y":30,"z":10},{"x":-52,"y":30,"z":10},{"x":-60,"y":30,"z":20}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53907.640230768775,"id":43},{"vertices":[{"x":-52,"y":30,"z":10},{"x":-57,"y":20,"z":10},{"x":-67,"y":20,"z":20},{"x":-60,"y":30,"z":20}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53908.66656670335,"id":44},{"vertices":[{"x":-67,"y":-20,"z":27},{"x":-57,"y":-20,"z":70},{"x":-57,"y":20,"z":70},{"x":-67,"y":20,"z":27}],"color":{"r":64,"g":64,"b":96,"a":"0.9"},"m":53904.23171004295,"id":45},{"vertices":[{"x":-60,"y":-30,"z":20},{"x":-45,"y":-30,"z":20},{"x":-45,"y":-30,"z":27},{"x":-60,"y":-30,"z":27}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53867.376105579904,"id":46},{"vertices":[{"x":-60,"y":-30,"z":20},{"x":-67,"y":-20,"z":20},{"x":-67,"y":-20,"z":27},{"x":-60,"y":-30,"z":27}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53877.2234761592,"id":47},{"vertices":[{"x":-67,"y":-20,"z":20},{"x":-67,"y":-20,"z":27},{"x":-67,"y":20,"z":27},{"x":-67,"y":20,"z":20}],"color":{"r":160,"g":160,"b":160,"a":"0.9"},"m":53897.72760747897,"id":48},{"vertices":[{"x":-45,"y":-20,"z":80},{"x":-57,"y":-20,"z":70},{"x":-57,"y":20,"z":70},{"x":-45,"y":20,"z":80}],"color":{"r":255,"g":239,"b":32,"a":"0.9"},"m":53907.96069227624,"id":49}],"name":"Example"};

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
        if (localStorage.mesh !== undefined) {
            mesh = JSON.parse(localStorage.mesh);
        } else {
            localStorage.mesh=JSON.stringify(mesh);
            meshView.fitToView();
        }
        document.getElementById('inpName').value=mesh.name;
    }

    function getMesh() {
        return mesh;
    }

    function turnVertical() {
        for(var i=0;i < mesh.faces.length;i++) {
            var face=mesh.faces[i];
            for(var j=0;j < face.vertices.length;j++) {
                var vert=face.vertices[j];
                vert.z*=-1;
            }
        }
    }

    function turnHorizontal() {
        for(var i=0;i < mesh.faces.length;i++) {
            var face=mesh.faces[i];
            for(var j=0;j < face.vertices.length;j++) {
                var vert=face.vertices[j];
                vert.x*=-1;
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



    function toSpriteImage(n,mag) {
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
            var canvasHeight=hh*mag;
            var canvasWidth=ww*mag;
            console.log(dims.tw,dims.th,xcnt,ycnt,ww,hh,mag,canvasWidth,canvasHeight,n);
            gui.reCreateCanvas(ly,{w:canvasWidth,h:canvasHeight+52});
            var ctx=layer.ctx;
            if (n === 1) {
                var sx=0;
                var sy=dims.th;
                var m=gui.getInvXY(ly,{x:sx+dims.tx,y:sy-dims.ty});
                meshView.paintMesh(ly,obj,m,0,1);
            } else {
                var dd=~~(360/n);
                var ddeg=0;
                for(var i=0;i < ycnt;i++) {
                    for(var j=0;j < xcnt;j++) {
                        var sx=(j*dims.tw);
                        var sy=((i+1)*dims.th);
                        var m=gui.getInvXY(ly,{x:sx+dims.tx,y:sy-dims.ty});
                        ctx.strokeStyle='#DD0000';
                        meshView.paintMesh(ly,obj,m,ddeg,1);
                        ddeg+=dd;
                    }
                }
            }
            var txt="S:"+dims.tw+' x '+dims.th+' CP '+dims.tx+':'+(dims.th-dims.ty)+' n:'+n+' mag:'+mag;
            ctx.fillStyle='#FF0000';
            ctx.font=""+(n === 1 && dims.tw < 200 ? 11 : 14)+"px Arial";
            ctx.fillText(txt ,1,canvasHeight+15);
            var image=gui.canvasToImage(ly);
            return image;

        }
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


    function get2DDim(deg) {
        var tl;
        var br;
        var fxys=[];
        for(var i=0;i < mesh.faces.length;i++) {
            var face=mesh.faces[i];
            for(var j=0;j < face.vertices.length;j++) {
                var vert=face.vertices[j];
                var p=coord.flatXYZ(vert,{x:0,y:0},deg);
                var x=p.x+p.y;
                var y=(p.x-p.y)+(vert.z*2);
                x=parseInt(x+.5)
                y=parseInt(y+.5);
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

    function setName(name) {
        if (mesh !== undefined) {
            mesh.name=name;
            save();
        }
    }

    return {
        init: init,
        saveToFile : saveToFile,
        setName: setName,
        get2DDim : get2DDim,
        toSpriteImage: toSpriteImage,
        mesh: getMesh,
        addFace : addFace,
        removeFace : removeFace,
        newMesh: newMesh,
        turnVertical : turnVertical,
        turnHorizontal : turnHorizontal,
        save: save,
        getObjDims: getObjDims,
        loadX3d : loadX3d,
        load: load
    };

})();
