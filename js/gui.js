var gui = (function () {


    var layers={};
    layers["canvas"]={fldh:0.5,fldw:1,w:0,h:0,mag:1,mx:0,my:0,mode:0,canvas : null,bgcolor:'#F0F0F0',ctx : null};
    layers["imgcanvas"]={fixed:true,hidden: true,fldh:0.5,fldw:1,w:0,h:0,mag:1,mx:0,my:0,mode:0,canvas : null,ctx : null};
    var mm=1.1;


    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {r: parseInt(result[1], 16),g: parseInt(result[2], 16),b: parseInt(result[3], 16),a:1} : null;
    }

    function rgbaToFn(col) {
        return "rgba(" + col.r +','+ col.g + ',' + col.b + ','+ col.a +')';
    }

    function glass(col) {
        var f=10;
        var ret={r:col.r-f,g:col.g-f,b:col.b-f,a:.3};
        return ret;
    }

    function cross(ly,p,col) {
        crossp(ly,getXY(ly,p),col);
    }

    function crossp(ly,sp,col) {
        var layer=layers[ly];
        layer.ctx.beginPath();
        layer.ctx.strokeStyle=col;
        layer.ctx.moveTo(sp.x,sp.y-5);
        layer.ctx.lineTo(sp.x,sp.y+5);
        layer.ctx.stroke();
        layer.ctx.moveTo(sp.x-5,sp.y);
        layer.ctx.lineTo(sp.x+5,sp.y);
        layer.ctx.stroke();

    }

    function init(m) {
        if (m !== undefined) {
            var layerKeys=Object.keys(layers);
            for(var i=0;i < layerKeys.length;i++) {
                mode(layerKeys[i],m);
            }
        }
        onResize();
    }


    function calcSprite(div,typ,p,d,swh) {
        var ret={};
        var spr=sprites[typ];
        if (spr !== undefined) {
            var spw=(swh === undefined ? spr.tiledim.w : swh.w);
            var sph=(swh === undefined ? spr.tiledim.h : swh.h);
            ret.tw=~~(spw*descr.mag);
            ret.th=~~(sph*descr.mag);
            ret.cp=getXY(p,descr);
            var dd=360-d;
            dd=~~((dd%360)/10);
            ret.spx=((dd)*spw)+40;
            ret.spy=0;
            ret.bckxpos=(~~(ret.spx*descr.mag));
            ret.bcksize=spr.img.width*descr.mag;
            ret.cx=(~~(spr.tiledim.cx*descr.mag));
            ret.cy=(~~(spr.tiledim.cy*descr.mag));
            ret.x=ret.cp.x-ret.cx;
            ret.y=ret.cp.y-ret.cy;
        }
        return ret;
    }

    function drawSprite(typ,id,p,d,sx,sy) {
        var spr=sprites[typ];
        if (spr !== undefined) {
            var spw=spr.tiledim.w;
            var sph=spr.tiledim.h;
            var tw=~~(spw*descr.mag);
            var th=~~(sph*descr.mag);

            var cp=getXY({x: p.x, y: p.y},descr);
            var dd=~~(((d+5)%360)/10);
            var spx=((dd)*spw);
            var spy=0;
            var sdims={
                x: cp.x-(~~(spr.tiledim.cx*descr.mag)),
                y: cp.y-(~~(spr.tiledim.cy*descr.mag)),
                w: tw,
                h: th
            };

            var tliv=pointInView({x : sdims.x,y : sdims.y},descr);
            var bliv=pointInView({x : sdims.x,y : sdims.y+sdims.h-1},descr);
            var triv=pointInView({x : sdims.x+sdims.w-1,y : sdims.y},descr);
            var briv=pointInView({x : sdims.x+sdims.w-1,y : sdims.y+sdims.h-1},descr);

            if (tliv || bliv || triv || briv) {
                var tx=sdims.x;
                var ty=sdims.y;
                if (tx <= 0) {
                    tw-=(-tx);
                    spw-=(-tx)/descr.mag;
                    spx+=(-tx)/descr.mag;
                    tx=0;
                }
                else if ((tx+tw) >= descr.w) {
                    tw=(descr.w-tx);
                    spw=tw/descr.mag;
                }

                if (ty <= 0) {
                    th-=(-ty);
                    sph-=(-ty)/descr.mag;
                    spy+=(-ty)/descr.mag;
                    ty=0;
                }
                else if (ty+th >= descr.h) {
                    th=(descr.h-ty);
                    sph=th/descr.mag;
                }
                descr.ctx.drawImage(spr.img,spx,spy,spw,sph,tx+sx,ty+sy,tw,th);
            }
        }

    }


    function inRect(ly,p,l) {
        var gp=getXY(ly,p);
        var gp0=getXY(ly,l.p0);
        var gp1=getXY(ly,l.p1);
        var tlx=(gp0.x < gp1.x ? gp0.x : gp1.x);
        var tly=(gp0.y < gp1.y ? gp0.y : gp1.y);
        var brx=(gp0.x > gp1.x ? gp0.x : gp1.x);
        var bry=(gp0.y > gp1.y ? gp0.y : gp1.y);

        if (gp.x < tlx) return false;
        if (gp.y < tly) return false;
        if (gp.x > brx) return false;
        if (gp.y > bry) return false;
        return true;
    }


    function pointInView(ly,p) {
        var layer=layers[ly];
        if (p.x < 0) return false;
        if (p.y < 0) return false;
        if (p.x >= layer.w) return false;
        if (p.y >= layer.h) return false;
        return true;
    }


    function inViewport(ly,l) {
        var layer=layers[ly];
        var ret={};
        if (pointInView(ly,l.p0)) ret.p0=l.p0;
        if (pointInView(ly,l.p1)) ret.p1=l.p1;
        if ((ret.p0 === undefined) || (ret.p1 === undefined)) {
            var px=coord.intersectOfLines(l,{p0: {x : 0,y : 0},p1: {x : layer.w-1,y : 0}});
            if (px !== undefined) {
                if (ret.p0 === undefined) ret.p0=px;
                else ret.p1=px;
            }
        }
        if ((ret.p0 === undefined) || (ret.p1 === undefined)) {
            px=coord.intersectOfLines(l,{p0: {x : layer.w-1,y : 0},p1: {x : layer.w-1,y : layer.h-1}});
            if (px !== undefined) {
                if (ret.p0 === undefined) ret.p0=px;
                else ret.p1=px;
            }
        }
        if ((ret.p0 === undefined) || (ret.p1 === undefined)) {
            px=coord.intersectOfLines(l,{p0: {x : layer.w-1,y : layer.h-1},p1: {x : 0,y : layer.h-1}});
            if (px !== undefined) {
                if (ret.p0 === undefined) ret.p0=px;
                else ret.p1=px;
            }
        }
        if ((ret.p0 === undefined) || (ret.p1 === undefined)) {
            px=coord.intersectOfLines(l,{p0: {x : 0, y : layer.h-1},p1: {x : 0,y : 0}});
            if (px !== undefined) {
                if (ret.p0 === undefined) ret.p0=px;
                else ret.p1=px;
            }
        }
        if ((ret.p0 === undefined) || (ret.p1 === undefined)) return;
        return ret;
    }



    function line(ly,l,col) {
        var pp0=getXY(ly,l.p0);
        var pp1=getXY(ly,l.p1);
        linep(ly,{p0 : pp0,p1 : pp1},col);        
    }

    function linep(ly,l,col) {
        var layer=layers[ly];
        var pp0=l.p0;
        var pp1=l.p1;
        var iline=inViewport(ly,{p0 : pp0,p1 : pp1});
        if (iline !== undefined) {
            layer.ctx.beginPath();
            layer.ctx.strokeStyle=col;
            layer.ctx.moveTo(iline.p0.x,iline.p0.y);
            layer.ctx.lineTo(iline.p1.x,iline.p1.y);
            layer.ctx.stroke();
        }
    }


    function circle(ly,p,r,col) {
        var layer=layers[ly];
        var pp=getXY(ly,p);
        var rp=r*layer.mag;
        layer.ctx.beginPath();
        layer.ctx.strokeStyle=col;
        layer.ctx.arc(pp.x,pp.y,rp,0,2*Math.PI,false);        
        layer.ctx.stroke();
    }



    function lineW(ly,l,col,lw) {
        var layer=layers[ly];
        layer.ctx.lineWidth=~~(lw*layer.mag);
        var pp0=getXY(ly,l.p0);
        var pp1=getXY(ly,l.p1);
        var iline=inViewport(ly,{p0 : pp0,p1 : pp1});
        if (iline !== undefined) {
            layer.ctx.beginPath();
            layer.ctx.strokeStyle=col;
            layer.ctx.moveTo(iline.p0.x,iline.p0.y);
            layer.ctx.lineTo(iline.p1.x,iline.p1.y);
            layer.ctx.stroke();
        }
        layer.ctx.lineWidth=1;
    }


    function polygon(ps,col,fcol) {
        var lp=null;
        var lines=[];
        for(var i=0;i < ps.length;i++) {
            var p=getXY(ps[i],descr);
            if (lp !== null) {
                var ln=inViewport({p0 : lp,p1 : p},descr);
                if (ln !== undefined) lines.push(ln);
            }
            lp=p;
        }
        if(lines.length > 0) {
            descr.ctx.beginPath();
            descr.ctx.fillStyle=col;
            for(var i=0;i < lines.length;i++) {
                var ln=lines[i];
                if (i === 0) descr.ctx.moveTo(ln.p0.x,ln.p0.y);
                else descr.ctx.lineTo(ln.p0.x,ln.p0.y);
                descr.ctx.lineTo(ln.p1.x,ln.p1.y);
            }
            descr.ctx.closePath();
            descr.ctx.strokeStyle=col;
            descr.ctx.stroke();
            if (fcol !== undefined) {
                descr.ctx.fillStyle=fcol;
                descr.ctx.fill();
            }
        }

    }

    function drawText(ly,p,txt,col,deg,fsize) {
        var layer=layers[ly];
        var gp=getXY(ly,p);
        var rad=Math.PI/180*deg;
        layer.ctx.save();        
        layer.ctx.translate(gp.x,gp.y);
        layer.ctx.rotate(rad);
        layer.ctx.translate(-gp.x,-gp.y);
        layer.ctx.fillStyle=col;
        layer.ctx.font=''+fsize+'px Arial';
        layer.ctx.fillText(txt,gp.x,gp.y);
        layer.ctx.restore();
    }


    function drawFloatText(ly,txt,l,col) {
        var txth=8;
        var txtw=8*txt.length;
        var pm=coord.calcMiddle(l).p;
        var gp=getXY(pm,descr);
        layer.ctx.fillStyle=col;
        layer.ctx.fillText(txt,gp.x-(txtw/2),gp.y+(txth/2));

    }

    function rect(ly,r,col,blur) {
        var layer=layers[ly];
        var pp0=getXY(ly,r.p0);
        var pp1=getXY(ly,r.p1);
        var pp2=getXY(ly,r.p2);
        var pp3=getXY(ly,r.p3);

        
        var lines=[];
        var ln=inViewport(ly,{p0 : pp0,p1 : pp1});
        if (ln !== undefined) lines.push(ln);
        ln=inViewport(ly,{p0 : pp1,p1 : pp2});
        if (ln !== undefined) lines.push(ln);
        ln=inViewport(ly,{p0 : pp2,p1 : pp3});
        if (ln !== undefined) lines.push(ln);
        ln=inViewport(ly,{p0 : pp3,p1 : pp0});
        if (ln !== undefined) lines.push(ln);

        if(lines.length > 0) {

            layer.ctx.beginPath();
            if (blur !== undefined) layer.ctx.shadowBlur=blur;
            layer.ctx.shadowColor=col;
            layer.ctx.fillStyle=col;
            for(var i=0;i < lines.length;i++) {
                var ln=lines[i];
                if (i === 0) layer.ctx.moveTo(ln.p0.x,ln.p0.y);
                else layer.ctx.lineTo(ln.p0.x,ln.p0.y);
                layer.ctx.lineTo(ln.p1.x,ln.p1.y);
            }
            layer.ctx.closePath();
            layer.ctx.fill();
            layer.ctx.shadowBlur=0;
        }
    }


    function getAbsXY(ly,p) {
        var layer=layers[ly];
        if (layer.mode === 0) {
            var x=p.x+p.y;
            var y=p.x-p.y;
            x*=layer.fldw;
            y*=layer.fldh;
            return {x: ~~(x+.5),y: ~~(y+.5)};
        } else {
            return {x: ~~(p.x+.5),y: ~~(p.y+.5)};
        }
    }

    function getMagXY(ly,p) {
        var layer=layers[ly];
        var res=getAbsXY(ly,p);
        if (layer.mode === 0) {
            res.x*=layer.mag;
            res.y*=layer.mag;
            res.y=layer.h-res.y;
            return {x: ~~(res.x+.5),y: ~~(res.y+.5)};
        } else {
            res.x*=layer.mag;
            res.y*=layer.mag;
            return {x: ~~(res.x+.5),y: ~~(res.y+.5)};
        }
    }

    function getXY(ly,p) {
        var res=getMagXY(ly,p);
        var layer=layers[ly];
        return {x: res.x+layer.mx,y: res.y+layer.my};
    }

    function getInvXY(ly,p) {
        var layer=layers[ly];
        if (layer.mode === 0) {
            var tx=(p.x-layer.mx);
            var ty=(p.y-layer.my);
            ty=layer.h-ty;
            tx/=layer.mag;
            ty/=layer.mag;
            tx/=layer.fldw;
            ty/=layer.fldh;
            var x=(tx+ty)/2;
            var y=x-ty;
            return {x: Math.round(x),y: Math.round(y)};
        } else {
            var tx=(p.x-layer.mx);
            var ty=(p.y-layer.my);
            ty=ty;
            tx/=layer.mag;
            ty/=layer.mag;
            var x=tx;
            var y=ty;
            return {x: Math.round(x),y: Math.round(y)};
        }
    }


    function getXYZ(ly,pp,cp,deg) {
        var layer=layers[ly];
        if (layer.mode === 0) {
            var p=coord.flatXYZ(pp,cp,deg);
            var x=p.x+p.y;
            var y=(p.x-p.y)+(pp.z*2);
            x*=layer.fldw;
            y*=layer.fldh;
            x*=layer.mag;
            y*=layer.mag;
            y=layer.h-y;
            x+=layer.mx;
            y+=layer.my;
            return {x: ~~(x+.5),y: ~~(y+.5)};
        } else {
            return getXY(ly,pp);
        }
    }

    function getAbsXYZ(ly,pp,cp,deg) {
        var layer=layers[ly];
        if (layer.mode === 0) {
            var p=coord.flatXYZ(pp,cp,deg);
            var x=p.x+p.y;
            var y=(p.x-p.y)+(pp.z*2);
            x*=layer.fldw;
            y*=layer.fldh;
            x*=layer.mag;
            y*=layer.mag;
            return {x: ~~(x+.5),y: ~~(y+.5)};
        } else {
            return getXY(ly,pp);
        }
    }


    function fitToViewport(ly,dims) {
        var layer=layers[ly];
    	if (layer.fixed) return;
        if (dims.topLeft === null) return;
        var bl={x: dims.topLeft.x,y: dims.rightBottom.y};
        var tr={x: dims.rightBottom.x,y: dims.topLeft.y};
        var gtl=getAbsXY(ly,dims.topLeft);
        var gbr=getAbsXY(ly,dims.rightBottom);
        var gbl=getAbsXY(ly,bl);
        var gtr=getAbsXY(ly,tr);
        var dx=gbr.x-gtl.x;
        var dy=(layer.mode === 0 ? -(gbl.y-gtr.y) : (gbl.y-gtr.y));
        var magx=layer.w/dx;
        var magy=layer.h/dy;
        if (magx < magy) layer.mag=Math.abs(magx);
        else layer.mag=Math.abs(magy);
        var ddx=dx*layer.mag;
        var ddy=dy*layer.mag;
        layer.mx=0;
        layer.my=0;
        var ttl=getXY(ly,dims.topLeft);
        var tbr=getXY(ly,dims.rightBottom);    
        var tbl=getXY(ly,bl);
        var ttr=getXY(ly,tr);
        var mx0=-ttl.x;
        var my0=-ttr.y;
        var tdx=tbr.x-ttl.x;
        var tdy=tbl.y-ttr.y;
        var shx=~~((layer.w-tdx)/2);
        var shy=~~((layer.h-tdy)/2);
        layer.mx=mx0+shx;
        layer.my=my0+shy;
        return layer;
    }

    function arrow(p,d,len,col,fcol) {
        var s=coord.nextPoint(p,len,d);
        var s1=coord.nextPoint(p,~~(len/2),d+90);
        var s2=coord.nextPoint(p,~~(len/2),d-90);
        var pts=[p,s1,s,s2,p];
        polygon(pts,col,fcol);
    }

    var mapImages=[];

    function putImage(name,x,y) {
        var selSphere;
        if (mapImages[name] !== undefined) {
            selSphere=mapImages[name];
        } else {
            selSphere=new Image();
            selSphere.src='imgs/'+name+'.png';
            mapImages[name]=selSphere;
        }
        var pp=getXY({x:x,y:y},descr);

//        if (pointInView(pp,descr)) {
            drawImg(selSphere,pp,selSphere.width,selSphere.height);
//        }

    }

    function drawImg(img,p,sw,sh) {
        var tliv=pointInView({x : p.x,y : p.y});
        var bliv=pointInView({x : p.x,y : p.y+sh-1});
        var triv=pointInView({x : p.x+sw-1,y : p.y});
        var briv=pointInView({x : p.x+sw-1,y : p.y+sh-1});
        if (tliv || bliv || triv || briv) {
            var tw=(sw*descr.mag);
            var th=(sh*descr.mag);
            descr.ctx.drawImage(img,0,0,sw,sh,p.x,p.y,tw,th);
        }
    }

    function reCreateCanvas(ly,r) {
        var contentDiv=document.getElementById('content');
        var layer=layers[ly];
        if (layer.canvas !== null) contentDiv.removeChild(layer.canvas);
        layer.canvas=document.createElement('canvas');
        layer.canvas.id=ly;
        layer.canvas.className='mapcanvas';
        contentDiv.appendChild(layer.canvas);
        layer.canvas.width=r.w;
        layer.canvas.height=r.h; 
        layer.w=r.w;        
        layer.h=r.h;        
        if (r.mx !== undefined) layer.mx=r.mx;
        if (r.my !== undefined) layer.my=r.my;
        layer.ctx = layer.canvas.getContext("2d");    
    }


    function onResize() {
        var contentDiv=document.getElementById('content');
        var layerKeys=Object.keys(layers);
        for(var i=0;i < layerKeys.length;i++) {
	        var layer=layers[layerKeys[i]];
        	var r=(layer.fixed ? {w:layer.w,h:layer.h} : {w:window.innerWidth-16,h:window.innerHeight-16});
	       	if (!layer.hidden) reCreateCanvas(layerKeys[i],r);
        }
        clearAll();
    }

    function clear(ly) {
        var layer=layers[ly];
        if (layer.ctx !== null) {
            if ((layer.bgcolor === undefined) || (layer.bgcolor === '')) {  
                layer.ctx.clearRect(0,0,layer.w,layer.h); 
            } else {
                layer.ctx.fillStyle=layer.bgcolor;
                layer.ctx.fillRect(0,0,layer.w,layer.h); 
            }
        }
    }

    function clearAll() {
        var layerKeys=Object.keys(layers);
        for(var i=0;i < layerKeys.length;i++) {
            clear(layerKeys[i]);
        }
    }

    function mode(ly,m) {
        if (m === undefined) return layers[ly].mode;
        layers[ly].mode=m;
    }

    function moveByPos(ly,p) {
        var layer=layers[ly];
        layer.mx+=p.x;
        layer.my+=p.y;
        onResize();
    }

    function getDistance(ly,d) {
        var layer=layers[ly];
        return d*layer.mag;
    }


    function magPlus(ly,pos) {
        var layer=layers[ly];
        layer.mag*=mm;
    }

    function setMag(ly,mag) {
        var layer=layers[ly];
        layer.mag=mag;
    }

    function setM(ly,p) {
        var layer=layers[ly];
        layer.mx=p.x;
        layer.my=p.y;
    }


    function magMinus(ly,pos) {
        var layer=layers[ly];
        layer.mag/=mm;
    }


    function fitToViewports(r) {
        var layerKeys=Object.keys(layers);
        for(var i=0;i < layerKeys.length;i++) fitToViewport(layerKeys[i],r);
    }

    function canvasToImage(ly) {
        var layer=layers[ly];
        return layer.canvas.toDataURL("image/png;base64;");
    }

    function removeCanvas(ly) {
        var layer=layers[ly];
        if (layer.canvas !== null) contentDiv.removeChild(layer.canvas);
        layer.canvas=null;
        layer.ctx=0;
    }

    function getDims(ly) {
        var layer=layers[ly];
        var scpw=parseInt(layer.w/2);
        var scph=parseInt(layer.h/2);
        var ret={w:layer.w,h:layer.h,cp:getInvXY(ly,{x:scpw,y:scph})};
        return ret;

    }

    function getContext(ly) {
        return layers[ly].ctx;
    }



    return {
        hexToRgb : hexToRgb,
        rgbToHex : rgbToHex,
        rgbaToFn : rgbaToFn,

        getContext : getContext,
        drawText : drawText,
        getDims : getDims,
        removeCanvas : removeCanvas,
        canvasToImage : canvasToImage,
        reCreateCanvas : reCreateCanvas,
        componentToHex : componentToHex,
        mode : mode,
        onResize : onResize,
        clear : clear,
        magPlus : magPlus,
        setMag : setMag,
        magMinus : magMinus,
        setM : setM,

        getDistance : getDistance,
        moveByPos : moveByPos,

        getXYZ : getXYZ,
        getAbsXYZ : getAbsXYZ,
        glass : glass,
        init : init,
        getXY : getXY,
        fitToViewports : fitToViewports,
        drawSprite : drawSprite,
        getInvXY : getInvXY,
        polygon : polygon,
        line : line,
        linep : linep,
        lineW : lineW,
        rect : rect,
        drawFloatText : drawFloatText,
        inRect : inRect,
        cross : cross,
        crossp : crossp,
        putImage :  putImage,
        circle : circle,
        arrow : arrow
    };

})();



