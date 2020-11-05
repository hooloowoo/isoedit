var mImggen=(function () {

    var highlightedId=-1;
    var lastDeg=0;

    var mObj=null;


    var mOpacity=.1;

    function getObject() {
        return mObj;
    }

    var camerap={x:30000,y:-40000,z:-20000};
    var lightsrc={x:1,y:80,z:240};



    function drawPointer(ly,p) {
        var face={
            "vertices":
                [{"x":p.x-10,"y":p.y-10,"z":p.z},
                 {"x":p.x+10,"y":p.y-10,"z":p.z},
                 {"x":p.x+10,"y":p.y+10,"z":p.z},
                 {"x":p.x-10,"y":p.y+10,"z":p.z}],
            "color":{"r":255,"g":0,"b":0,"a":"1"}};
//        drawShadow(ly,face,p,{cp:{x:0,y:0,z:0}},0);
        drawFace(ly,face,p,{cp:{x:0,y:0,z:0}},0);
    }


    function drawShadow(ly,face,cp,obj,deg) {
        var ctx=gui.getContext(ly);
        var sColor={r:64,g:64,b:64,a:.1};
        var fStyle=gui.rgbaToFn(sColor);
        ctx.fillStyle=fStyle;
        ctx.beginPath();
        for(var k=0;k < face.vertices.length;k++) {
            var vtx=face.vertices[k];
            var xyz={x: (vtx.x+cp.x)-obj.cp.x,y:(vtx.y+cp.y)-obj.cp.y,z:0};
            var sp=gui.getXYZ(ly,xyz,cp,deg);
            if (k === 0) ctx.moveTo(sp.x,sp.y+10);
            else ctx.lineTo(sp.x,sp.y+10);
        }
        ctx.closePath();
        ctx.fill();
    }



    function drawFace(ly,face,cp,obj,deg) {
        var ctx=gui.getContext(ly);
        if (face.texture !== undefined) {
            if (face.vertices.length === 4) {
                var img=new Image();
                img.src=face.texture;
                var pts=[
                    {x:0,y:0,u:0,v:img.height},
                    {x:0,y:0,u:img.width,v:img.height},
                    {x:0,y:0,u:img.width,v:0},
                    {x:0,y:0,u:0,v:0}
                ];
                for(var k=0;k < face.vertices.length;k++) {
                    var vtx=face.vertices[k];
                    var xyz={x: (vtx.x+cp.x)-obj.cp.x,y:(vtx.y+cp.y)-obj.cp.y,z:vtx.z};
                    var sp=gui.getXYZ(ly,xyz,cp,deg);
                    pts[k].x=sp.x;pts[k].y=sp.y;
                }
                textureMap(ctx, img, pts);
            }
        }

        var fColor={r:face.color.r,g:face.color.g,b:face.color.b,a:face.color.a};
        fColor.a=(face.id === highlightedId ? 1 : mOpacity);
        var dc=1;



        var vtx=face.vertices[0];

        var ld=coord.calcDeg({p0:{x:0,y:0},p1:lightsrc});
        var ll=coord.calcLen({p0:{x:0,y:0},p1:lightsrc});
        var np=coord.nextPoint({x:0,y:0},ll,(ld+deg));
        np.z=lightsrc.z;
        // np is the ligthsource updated with degree of viewport.
        
        var ac=Math.abs(coord.getCosAngle3d(np,face));
        var dc=(ac/2)+.8; // just lighten a bit

        if (face.texture === undefined) {
            fColor.r=~~(fColor.r*dc);
            fColor.g=~~(fColor.g*dc);
            fColor.b=~~(fColor.b*dc);
        } else {
            fColor.r=128;
            fColor.g=128;
            fColor.b=128;
            fColor.a=(dc/2); //0 - 0.5
        }


        var sColor={r:~~(fColor.r/2),g:~~(fColor.g/2),b:~~(fColor.b/2),a:mOpacity};
        
        var sStyle=gui.rgbaToFn(sColor);
        var fStyle=gui.rgbaToFn(fColor);
        ctx.strokeStyle=sStyle;
        ctx.fillStyle=fStyle;
        ctx.beginPath();
        for(var k=0;k < face.vertices.length;k++) {
            var vtx=face.vertices[k];
            var xyz={x: (vtx.x+cp.x)-obj.cp.x,y:(vtx.y+cp.y)-obj.cp.y,z:vtx.z};
            var sp=gui.getXYZ(ly,xyz,cp,deg);
            if (k === 0) ctx.moveTo(sp.x,sp.y);
            else ctx.lineTo(sp.x,sp.y);
        }
        ctx.closePath();
        if (mIgg.getLinesOff() === 0) ctx.stroke();
        ctx.fill();
    }


    function drawObject(ly,obj,cp,deg) { 
        if(mObj === null) return;
        if (obj.faces == null) return;
        var sfaces=[];
        var ccp=(obj.cp === undefined ? cp : obj.cp);
        if (ccp === undefined) ccp={x:0,y:0};

        for(var j=0;j < obj.faces.length;j++) {
            var mp={x:0,y:0,z:0};
            var face=obj.faces[j];
            var zdist=null;
            for(var k=0;k < face.vertices.length;k++) {
                var vtx=face.vertices[k];
                var xyz={x: (vtx.x+cp.x)-ccp.x,y:(vtx.y+ccp.y)-ccp.y,z:vtx.z};
                var sp=coord.flatXYZ(xyz,ccp,deg);
                mp.x+=sp.x;
                mp.y+=sp.y;
                mp.z+=xyz.z;
            }
            mp.x/=face.vertices.length;
            mp.y/=face.vertices.length;
            mp.z/=face.vertices.length;
            var zd=coord.calcLen3d({p0:camerap,p1:mp});
            if ((zdist === null) || (zd < zdist)) zdist=zd;
            face.m=zdist;
            face.id=j;
        }            
        for(var j=0;j < obj.faces.length;j++) {
            var face=obj.faces[j];
            var fnd=false;
            for(var k=0;k < sfaces.length;k++) {
                if (face.m < sfaces[k].m) {
                    sfaces.splice(k,0,face);
                    fnd=true;
                    break;
                }
            }
            if (!fnd) sfaces.push(face);
        }
//        for(var j=0;j < sfaces.length;j++) drawShadow(ly,sfaces[j],cp,obj,deg);
        for(var j=0;j < sfaces.length;j++) drawFace(ly,sfaces[j],cp,obj,deg);
    }


    function textureMap(ctx, texture, pts) {
        var tris = [
            [0, 1, 2], [2, 3, 0]
            ]; 
        for (var t=0; t<2; t++) {
            var pp = tris[t];
            var x0 = pts[pp[0]].x, x1 = pts[pp[1]].x, x2 = pts[pp[2]].x;
            var y0 = pts[pp[0]].y, y1 = pts[pp[1]].y, y2 = pts[pp[2]].y;
            var u0 = pts[pp[0]].u, u1 = pts[pp[1]].u, u2 = pts[pp[2]].u;
            var v0 = pts[pp[0]].v, v1 = pts[pp[1]].v, v2 = pts[pp[2]].v;
            ctx.save(); 
            ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2); ctx.closePath(); 
            ctx.clip();
            var delta = u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
            var delta_a = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
            var delta_b = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
            var delta_c = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2 - v0*u1*x2 - u0*x1*v2;
            var delta_d = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
            var delta_e = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
            var delta_f = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2-v0*u1*y2-u0*y1*v2;
            ctx.transform(delta_a/delta, delta_d/delta,delta_b/delta, delta_e/delta,delta_c/delta, delta_f/delta);
            ctx.drawImage(texture, 0, 0);
            ctx.restore();
        }
    }


/*    function loadTexture(name) {
        if (textures[name] !== undefined) return textures[name];
        var txte=new Image();
        txte.src='imgs/'+name+'.png';
        textures[name]=txte;
        return txte;
    }*/

    function init() {
        load();
        //newFile();
    }

    function paint(deg) {
        if (deg !== undefined) lastDeg=deg;
        var ly='canvas';
        gui.clear(ly);
//        var dims=gui.getDims(ly);
//        var cp=dims.cp;
        var cp={x:0,y:0};
        drawObject(ly,mObj,cp,lastDeg);
//        drawPointer(ly,lightsrc);


    }


    function conv() {
        for(var i=0;i < mObj.faces.length;i++) {
            var face=mObj.faces[i];
            for(var j=0;j < face.vertices.length;j++) {
//                if (face.vertices[j].z > 30) face.vertices[j].z+=5;
//                face.vertices[j].x*=1.2;
                face.vertices[j].z*=.6;
//                face.vertices[j].z*=1.2;
            }
        }
    }

    function saveToFile() {
        var a = document.createElement("a");
//        applyCp();

        var file = new Blob([JSON.stringify(mObj)], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = mObj.name+'.json';
        a.click();
    }


    function saveToServer() {
        var str=JSON.stringify(mObj);
        var data=btoa(str);
        ajax.saveString(mObj.name+'.json','application/json','data='+data,'obj');
    }


    function newFile() {
        mObj={faces:[],cp:{x:0,y:0}};
        document.getElementById('tbinput_objectName').value='New';
        mEditorPane.init(mObj);
        paint();
    }



    function load(pstr) {
        var str=null;
        if (pstr !== undefined) {
            str=pstr;
        } else {
            if (localStorage.mobj3d !== undefined) str=localStorage.mobj3d;
        }
        if (str !== null) {
            mObj=JSON.parse(str);
            if (mObj.faces === undefined) mObj=JSON.parse(mObj);
            if (pstr !== undefined) localStorage.mobj3d=JSON.stringify(str);
        }
        if (mObj !== null) {
            if (mObj.name !== undefined) document.getElementById('tbinput_objectName').value=mObj.name;
            mEditorPane.init(mObj);
            paint();
        }
    }


    function loadX3d(str) {
        var mag=1000;
        if (str !== null) {
//            mObj=JSON.parse(str);
            
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

            mObj=x3dobj;

        }
        if (mObj !== null) {
            if (mObj.name !== undefined) document.getElementById('tbinput_objectName').value=mObj.name;
            mEditorPane.init(mObj);
            paint();
        }
    }


    function highlightFace(id) {
        highlightedId=id;
        paint(lastDeg);
    }

    function clear() {
        localStorage.removeItem('mobj3d');
        mObj=null;
        var ly='canvas';
        gui.clear(ly);
        mEditorPane.clear();
    }

    function removeFaceById(fid) {
         mObj.faces.splice(fid, 1);
         paint();
     }


    function setOpacity(op) {
        mOpacity=op;
        paint();
    }

    function setName(n) {
        if (mObj !== null) mObj.name=n;
    }

    function getRect() {
        var cp=gui.getDims('canvas').cp;
        var topLeft=null;
        var rightBottom={x : 0,y : 0};
        for(var deg=0;deg < 360;deg++) {   
            for(var j=0;j < mObj.faces.length;j++) {
                var mp={x:0,y:0,z:0};
                var face=mObj.faces[j];
                var zdist=null;
                for(var k=0;k < face.vertices.length;k++) {
                    var vtx=face.vertices[k];
                    var xyz={x: (vtx.x+cp.x)-mObj.cp.x,y:(vtx.y+cp.y)-mObj.cp.y,z:vtx.z};
                    var sp=coord.flatXYZ(xyz,cp,deg);
                    if (topLeft === null) topLeft={x: sp.x,y:sp.y};
                    if (sp.x < topLeft.x) topLeft.x=sp.x;
                    if (sp.y < topLeft.y) topLeft.y=sp.y;
                    if (sp.x > rightBottom.x) rightBottom.x=sp.x;
                    if (sp.y > rightBottom.y) rightBottom.y=sp.y;
                }
            }            
        }
        return {topLeft : topLeft, rightBottom : rightBottom};
    }

    function addFace(typ) {
        var nvxs=[{x:-10.0,y:-10.0,z:0.0},{x:10.0,y:-10.0,z:0.0},{x:10.0,y:10.0,z:0.0},{x:-10.0,y:10.0,z:0.0}];
        var nface={vertices:[],color:{r:160,g:160,b:160,a:1}};
        if ((typ === 3) || (typ === 4)) {
            for(var i=0; i < typ;i++) nface.vertices.push(nvxs[i]);
        }
        mObj.faces.push(nface);
        paint();
    }

    function createCyl(r,l,parts,col) {

        var cp={x:0,y:0};
        var pdeg=(360/parts);
        for(var i=0;i < parts;i++) {
            var nface={vertices:[],color:{r:col.r,g:col.g,b:col.b,a:col.a}};
            
            var p0=coord.nextPoint(cp,r,pdeg*i);
            var p1=coord.nextPoint(cp,r,pdeg*(i+1));
            p0.z=0;
            p1.z=0;
            var p2={x:p0.x,y:p0.y,z:l};
            var p3={x:p1.x,y:p1.y,z:l};
            nface.vertices=[p0,p1,p3,p2];
            mObj.faces.push(nface);
        }

        paint();
    }
/* --------- IMAGE CREATION ------------------- */



    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {

        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function rgbToFn(r, g, b) {
        return "rgba(" + r +','+ g + ',' + b + ',1)';
    }



    function getObjDims(ly,obj,mag) {
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
        var obj=mObj;
        if (obj !== undefined) {
            var ly='imgcanvas';
            gui.setMag(ly,1/mag);
            var dims=getObjDims(ly,obj);
            console.log(dims);
            var xcnt=18;
            var ycnt=(~~(n/18));
            var ww=(n === 1 ? dims.tw : (dims.tw)*xcnt);
            var hh=(n === 1 ? dims.th : (dims.th)*ycnt);


            gui.reCreateCanvas(ly,{w:ww,h:hh+52});
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
                        var ctx=gui.getContext(ly);
                        ctx.strokeStyle='#DD0000';
/*                        ctx.beginPath();
                        ctx.moveTo(sx,sy);
                        ctx.lineTo(sx+(dims.tw),sy);
                        ctx.lineTo(sx+(dims.tw),sy-(dims.th));
                        ctx.lineTo(sx,sy-(dims.th));
                        ctx.lineTo(sx,sy);
                        ctx.stroke();*/
//                        gui.line(ly,{p0:m,p1:{x:m.x-10,y:m.y+10}},'#FF0000');
                        drawObject(ly,obj,m,ddeg); 
                        ddeg+=dd;
                    }
                }
                var txt="Image size:"+dims.tw+' x '+dims.th+' CP '+dims.tx+':'+(dims.th-dims.ty)+' n:'+n+' mag:'+mag;
                gui.drawText(ly,gui.getInvXY(ly,{x:10,y:hh+((dims.th/2))+1}),txt,'#800000',0,14); 

//                ctx.fillStyle='#800000';
//                ctx.font="14px Arial";
//                ctx.fillText("Image size:"+dims.tw+' x '+dims.th+' CP '+dims.tx+':'+dims.ty+' n:'+n+' mag:'+mag ,10,hh);
            }

            var image=gui.canvasToImage(ly);
//            window.open(image,'_blank');



            var win = window.open();
            win.document.write('<iframe src="' + image  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        }


    }

    function toImage() {
        createImage(90,3);
    }

    return {
        toImage : toImage,
        createCyl : createCyl,
        conv : conv,
        setName : setName,
        setOpacity : setOpacity,
        addFace : addFace,
        removeFaceById : removeFaceById,
        clear : clear,
        load : load,
        newFile : newFile,
        loadX3d : loadX3d,
        saveToFile : saveToFile,
        saveToServer : saveToServer,
        highlightFace : highlightFace,
        getObject : getObject,
        getRect : getRect,
        init : init,
        paint : paint
    };
    
})();

