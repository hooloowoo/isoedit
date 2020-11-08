var meshView = (function() {

    var layerId='tiles';
    var idsLayerId='ids';
    var lastDeg=0;
    var camerap={x:30000,y:-40000,z:-20000};
    var lightsrc={x:0,y:2000,z:2400};
    var highlightedId=-1;
    var mOpacity=.7;
    var sfaces=[];

    var selected=0; // Starts at 1. To convert sfaces index decrease by 1.
    var selectedFace=-1;

    function init(ly) {
        layerId=ly;
    }

    function selectFace() {
        selectedFace=selected-1;
        if (selectedFace > -1) editBarView.setFace(sfaces[selectedFace]);
    }

    function setSelected(i) {
        var ret=selected !== i;
        selected=i;
        return ret;
    }

    function intToColor(pval) {
        var val=pval+1;
        var jr=val%256;
        var jg=(val/256)%256;
        var jb=(val/65536)%256;
        return {r:jr,g:jg,b:jb,a:1};

    }

    function drawIdFace(ly,j,mesh,cp,deg) {
        var face=sfaces[j];
        var ctx=gui.getLayer(ly).ctx;
        var fColor=intToColor(j);
        var sStyle=gui.rgbaToFn(fColor);
        ctx.strokeStyle=sStyle;
        ctx.fillStyle=sStyle;
        ctx.beginPath();
        for(var k=0;k < face.vertices.length;k++) {
            var vtx=face.vertices[k];
            var xyz={x: (vtx.x+cp.x)-mesh.cp.x,y:(vtx.y+cp.y)-mesh.cp.y,z:vtx.z};
            var sp=gui.getXYZ(ly,xyz,cp,deg === undefined ? lastDeg : deg);
            if (k === 0) ctx.moveTo(sp.x,sp.y);
            else ctx.lineTo(sp.x,sp.y);
        }
        ctx.closePath();
        if (toolBarView.isDrawLines()) ctx.stroke();
        ctx.fill();
    }

    function drawFace(ly,j,mesh,cp,deg,opacity) {
        var face=sfaces[j];
        var ctx=gui.getLayer(ly).ctx;
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
                    var xyz={x: (vtx.x+cp.x)-mesh.cp.x,y:(vtx.y+cp.y)-mesh.cp.y,z:vtx.z};
                    var sp=gui.getXYZ(ly,xyz,cp,(deg === undefined ? lastDeg : deg));
                    pts[k].x=sp.x;pts[k].y=sp.y;
                }
                textureMap(ctx, img, pts);
            }
        }

        var fColor={r:face.color.r,g:face.color.g,b:face.color.b,a:face.color.a};
        fColor.a=(face.id === highlightedId ? 1 : (opacity === undefined ? mOpacity : opacity));
        var ld=coord.calcDeg({p0:{x:0,y:0},p1:lightsrc});
        var ll=coord.calcLen({p0:{x:0,y:0},p1:lightsrc});
        var np=coord.nextPoint({x:0,y:0},ll,(ld+(deg === undefined ? lastDeg : deg)));
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

        var sColor={r:~~(fColor.r/2),g:~~(fColor.g/2),b:~~(fColor.b/2),a:(opacity === undefined ? mOpacity : opacity)};
        if (selected-1 === j) {
            sColor.a+=.2;
            fColor.a+=.2;
        }

        var sStyle=gui.rgbaToFn(sColor);
        var fStyle=gui.rgbaToFn(fColor);
        ctx.strokeStyle=sStyle;
        ctx.fillStyle=fStyle;
        ctx.beginPath();
        for(var k=0;k < face.vertices.length;k++) {
            var vtx=face.vertices[k];
            var xyz={x: (vtx.x+cp.x)-mesh.cp.x,y:(vtx.y+cp.y)-mesh.cp.y,z:vtx.z};
            var sp=gui.getXYZ(ly,xyz,cp,deg === undefined ? lastDeg : deg);
            if (k === 0) ctx.moveTo(sp.x,sp.y);
            else ctx.lineTo(sp.x,sp.y);
        }
        ctx.closePath();
        if (toolBarView.isDrawLines()) ctx.stroke();
        ctx.fill();
    }

    function textureMap(ctx, texture, pts) {
        var tris = [
            [0, 1, 2], [2, 3, 0]
        ];
        for (var t=0; t < 2; t++) {
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

    function fillSFaces(mesh,cp,deg) {
        if(mesh === null) return;
        if (mesh.faces == null) return;
        sfaces=[];
        var ccp=(mesh.cp === undefined ? cp : mesh.cp);
        if (ccp === undefined) ccp={x:0,y:0};
        for(var j=0;j < mesh.faces.length;j++) {
            var mp={x:0,y:0,z:0};
            var face=mesh.faces[j];
            var zdist=null;
            for(var k=0;k < face.vertices.length;k++) {
                var vtx=face.vertices[k];
                var xyz={x: (vtx.x+cp.x)-ccp.x,y:(vtx.y+ccp.y)-ccp.y,z:vtx.z};
                var sp=coord.flatXYZ(xyz,ccp,deg === undefined ? lastDeg : deg);
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
        for(var j=0;j < mesh.faces.length;j++) {
            var face=mesh.faces[j];
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
        return cp;
    }

    function paintMesh(ly,mesh,cp,deg,opacity) {
        cp=fillSFaces(mesh,cp,deg);
        for(var j=0;j < sfaces.length;j++) {
            drawFace(ly,j,mesh,cp,deg,opacity);
        }

    }

    function paint(mesh) {
        var cp=fillSFaces(mesh,{x:0,y:0});
        for(var j=0;j < sfaces.length;j++) {
            drawFace(layerId,j,mesh,cp);
            drawIdFace(idsLayerId,j,mesh,cp);
        }
/*
        var xtlbr=meshService.getObjDims(layerId,meshService.mesh());
        var tlbr={topLeft: xtlbr.tl,rightBottom: xtlbr.br};
        var layer=gui.getLayer(layerId);
        var p={x:tlbr.topLeft.x+(layer.w/2),y:tlbr.topLeft.y+(layer.h/2)};
        gui.crossp(layerId,p,'#FF0000');
        var p={x:tlbr.rightBottom.x+(layer.w/2),y:tlbr.rightBottom.y+(layer.h/2)};
        gui.crossp(layerId,p,'#0000FF');


        var tlbr=meshService.get2DDim((-lastDeg+90)%360);
        var p={x:tlbr.topLeft.x+(layer.w/2),y:tlbr.topLeft.y+(layer.h/2)};
        gui.crossp(layerId,p,'#00FF00');
        var p={x:tlbr.rightBottom.x+(layer.w/2),y:tlbr.rightBottom.y+(layer.h/2)};
        gui.crossp(layerId,p,'#00FFFF');

        for(var i=0;i < tlbr.fxys.length;i++) {
            var p={x:tlbr.fxys[i].x+(layer.w/2),y:tlbr.fxys[i].y+(layer.h/2)};
            gui.crossp(layerId,p,'#FFFF00');
        }*/
    }

    function moveDegree(d) {
        lastDeg+=d;
    }

    function moveOpacity(d) {
        mOpacity+=d;
        if (mOpacity < 0.05) mOpacity=0.05;
        if (mOpacity > 1) mOpacity=1;
    }

    function fitToView() {
        var tlbr=meshService.get2DDim((-lastDeg+90)%360);
        if ((tlbr.topLeft !== undefined) && (tlbr.rightBottom !== undefined)) {
            gui.fitToViewport(layerId, tlbr, 1);
            gui.fitToViewport(idsLayerId, tlbr, 1);
            canvasView.requestRepaint();
        }
    }


    return {
        init: init,
        paintMesh : paintMesh,
        fitToView : fitToView,
        moveDegree: moveDegree,
        setSelected : setSelected,
        selectFace : selectFace,
        moveOpacity: moveOpacity,
        paint : paint
    };

})();


