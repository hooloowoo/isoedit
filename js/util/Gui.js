var gui = (function () {

    var layers={};

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

    function rgbToFn(col) {
        return "rgb(" + col.r +','+ col.g + ',' + col.b + ')';
    }

    function rgbaToFn(col) {
        return "rgba(" + col.r +','+ col.g + ',' + col.b + ','+ col.a +')';
    }

    function glass(col) {
        var f=10;
        var ret={r:col.r-f,g:col.g-f,b:col.b-f,a:.3};
        return ret;
    }

    function idToRgb(id) {
        var r=~~(id/65536)%256;
        var g=~~((id/256)%256);
        var b=~~(id%256); 
        return {r:r,g:g,b:b};
    }

    function rgbToId(rgb) {
        var id=(rgb.r*65536)+(rgb.g*256)+(rgb.b);        
        return id;
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
    }

    function drawSprite2(ly,img,sp,p,po,cp,ptmag) {
        var layer=layers[ly];
        var tw=~~(sp.w*layer.mag);
        var th=~~(sp.h*layer.mag);
        var gp=getXY(ly,p);
        gp.x-=~~(cp.x*layer.mag);
        gp.y-=~~(cp.y*layer.mag);
        if (p.z !== undefined) gp.y-=~~(p.z*layer.mag);

        var tmag=(ptmag === undefined ? 1 : ptmag);
        layer.ctx.drawImage(img,
            po.x*layer.mag,po.y*layer.mag,
            tw,th,
            gp.x,gp.y,
            tw*layer.mag*tmag,th*layer.mag*tmag);
    }


    function drawSprite(ly,img,p,clip,dim,cpsh,ptmag) {
        var layer=layers[ly];

        var gp=getXY(ly,p);
        var tmag=(ptmag === undefined ? 1 : ptmag);

        gp.x-=~~(dim.sx*tmag*layer.mag);
        gp.y-=~~(dim.sy*tmag*layer.mag);

        layer.ctx.drawImage(img,
            clip.x,clip.y,
            dim.w,dim.h,
            gp.x-(cpsh.x*tmag*layer.mag),gp.y-(cpsh.y*tmag*layer.mag),
            dim.w*tmag*layer.mag,dim.h*tmag*layer.mag);



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





    function circle(ly,p,r,col) {
        var layer=layers[ly];
        var pp=getXY(ly,p);
        var rp=r*layer.mag;
        layer.ctx.beginPath();
        layer.ctx.strokeStyle=col;
        layer.ctx.arc(pp.x,pp.y,rp,0,2*Math.PI,false);        
        layer.ctx.stroke();
    }

    function ellipse(ly,p,r0,r1,deg,col,bcol) {
        var layer=layers[ly];
        var pp=getXY(ly,p);
        var rp0=r0*layer.mag;
        var rp1=r1*layer.mag;
        layer.ctx.beginPath();
        layer.ctx.strokeStyle=col;
        if (bcol !== undefined) layer.ctx.fillStyle=bcol;
        layer.ctx.ellipse(pp.x,pp.y, rp0, rp1,deg*Math.PI/180,0,2*Math.PI);
        layer.ctx.fill();
        layer.ctx.stroke();
    }


    function arc(ly,p,r,b,e,col,lw) {
        var layer=layers[ly];
        layer.ctx.lineWidth=~~(lw*layer.mag);
        var pp=getXY(ly,p);
        var rp=r*layer.mag;
        var lns=coord.linesOfArch(p,r,b,e);
        for(var i=0;i < lns.length;i++) {
            var ln=lns[i];
            lineW(ly,ln,col,lw);
        }
    }


    function line(ly,l,col) {
        var layer=layers[ly];
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
    }

    function lineW(ly,l,col,lw) {
        var layer=layers[ly];
        if (layer.mode === 0) {
            layer.ctx.lineWidth = 1;
            var pp0 = getXY(ly, l.p0);
            var pp1 = getXY(ly, l.p1);
            var iline = inViewport(ly, {p0: pp0, p1: pp1});
            if (iline !== undefined) {
                var glw=lw/2;
                var rl0=coord.paralell({p0:l.p0,p1:l.p1},glw,-1);
                var rl1=coord.paralell({p0:l.p0,p1:l.p1},glw,1);
                var gp0=getXY(ly,rl0.p0);
                var gp1=getXY(ly,rl0.p1);
                var gp2=getXY(ly,rl1.p1);
                var gp3=getXY(ly,rl1.p0);

                layer.ctx.fillStyle = col;
                layer.ctx.strokeStyle = col;
                layer.ctx.beginPath();
                layer.ctx.moveTo(gp0.x, gp0.y);
                layer.ctx.lineTo(gp1.x, gp1.y);
                layer.ctx.lineTo(gp2.x, gp2.y);
                layer.ctx.lineTo(gp3.x, gp3.y);
                layer.ctx.fill();
            }

        }else {
            layer.ctx.lineWidth = ~~(lw * layer.mag);
            var pp0 = getXY(ly, l.p0);
            var pp1 = getXY(ly, l.p1);
            var iline = inViewport(ly, {p0: pp0, p1: pp1});
            if (iline !== undefined) {
                layer.ctx.beginPath();
                layer.ctx.strokeStyle = col;
                layer.ctx.moveTo(iline.p0.x, iline.p0.y);
                layer.ctx.lineTo(iline.p1.x, iline.p1.y);
                layer.ctx.stroke();
            }
            layer.ctx.lineWidth = 1;
        }
    }


    function polygon(ly,ps,col,fcol) {
        var layer=layers[ly];
        var lp=null;
        var lines=[];
        for(var i=0;i < ps.length;i++) {
            var p=getXY(ly,ps[i]);
            if (lp !== null) {
                var ln=inViewport(ly,{p0 : lp,p1 : p});
                if (ln !== undefined) lines.push(ln);
            }
            lp=p;
        }
        if(lines.length > 0) {
            layer.ctx.beginPath();
            layer.ctx.fillStyle=col;
            for(var i=0;i < lines.length;i++) {
                var ln=lines[i];
                if (i === 0) layer.ctx.moveTo(ln.p0.x,ln.p0.y);
                else layer.ctx.lineTo(ln.p0.x,ln.p0.y);
                layer.ctx.lineTo(ln.p1.x,ln.p1.y);
            }
            layer.ctx.closePath();
            layer.ctx.strokeStyle=col;
            layer.ctx.stroke();
            if (fcol !== undefined) {
                layer.ctx.fillStyle=fcol;
                layer.ctx.fill();
            }
        }
    }

    function getTextDim(ly,p,txt,size,pmarg) {
        var layer=layers[ly];
        var marg=(pmarg === undefined ? 10: pmarg);
        var gmarg=marg*layer.mag;
        layer.ctx.font=''+(size*layer.mag)+'px Arial';
        var mt=layer.ctx.measureText(txt);
        var tdim={w:mt.width,h:size*layer.mag};
        var w2=tdim.w/2;
        var gp=getXY(ly,{x:p.x-w2,y:p.y});
        var ret={w:tdim.w+(gmarg*2),h:tdim.h+(gmarg*2),p0:{x:gp.x-gmarg,y:gp.y-gmarg},p1:{x:gp.x+tdim.w+gmarg,y:gp.y+tdim.h+gmarg}};
        return ret;
    }

    function getFloatTextDim(ly,l,txt,size,pmarg) {
        var layer=layers[ly];
        var marg=(pmarg === undefined ? 10: pmarg);
        var gmarg=marg*layer.mag;
        layer.ctx.font=''+(size*layer.mag)+'px Arial';
        var mt=layer.ctx.measureText(txt);
        var tdim={w:mt.width,h:size*layer.mag};
        var pm=coord.calcMiddle(l).p;
        var w2=tdim.w/2;
        var h2=tdim.h/2;
        var p0={x:pm.x-w2,y:pm.y-h2};
        var gp=getXY(ly,p0);
        var gmarg=marg*layer.mag;
        var ret={w:tdim.w+(gmarg*2),h:tdim.h+(gmarg*2),p0:{x:gp.x-gmarg,y:gp.y-gmarg},p1:{x:gp.x+tdim.w+gmarg,y:gp.y+tdim.h+gmarg}};
        return ret;
    }


    function drawText(ly,txt,p,col,bcol,size,pmarg) {
        var marg=(pmarg === undefined ? 10: pmarg);
        var layer=layers[ly];
        layer.ctx.font=''+(size*layer.mag)+'px Arial';
        var mt=layer.ctx.measureText(txt);
        var tdim={w:mt.width,h:size*layer.mag};
        var w2=tdim.w/2;
        var gmarg=marg*layer.mag;
        if (bcol !== null) {
            var gp=getXY(ly,{x:p.x-w2,y:p.y});
            layer.ctx.beginPath();
            layer.ctx.rect(gp.x-gmarg, gp.y-gmarg,tdim.w+(gmarg*2),tdim.h+(gmarg*2));
            layer.ctx.fillStyle=bcol;
            layer.ctx.fill();
        }
        var gp=getXY(ly,{x:p.x-w2,y:p.y+size});
        layer.ctx.fillStyle=col;
        layer.ctx.font=''+(size*layer.mag)+'px Arial';
        layer.ctx.fillText(txt,gp.x,gp.y);
    }


    function drawFloatText(ly,txt,l,col,bcol,size,pmarg) {
        var marg=(pmarg === undefined ? 10 : pmarg);
        var layer=layers[ly];
        layer.ctx.font=''+(size*layer.mag)+'px Arial';
        var mt=layer.ctx.measureText(txt);

        var tdim={w:mt.width,h:size*layer.mag};
        var pm=coord.calcMiddle(l).p;


        var h2=(tdim.h/2);
        var w2=(tdim.w/2);

        var p0={x:pm.x,y:pm.y};
        var gp=getXY(ly,p0);
        var gmarg=marg*layer.mag;
        if (bcol !== null) {
            layer.ctx.beginPath();
            layer.ctx.rect(gp.x-w2-gmarg, gp.y-h2-gmarg,tdim.w+(gmarg*2),tdim.h+(gmarg*2));
            layer.ctx.fillStyle=bcol;
            layer.ctx.fill();
        }
        layer.ctx.fillStyle=col;
        layer.ctx.fillText(txt,gp.x-w2,gp.y+h2-2);

    }

    function rect(ly,r,col,fcol,blur) {
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
            if ((fcol !== undefined) && (fcol !== null)) layer.ctx.fillStyle=fcol;
            layer.ctx.strokeStyle=col;
            for(var i=0;i < lines.length;i++) {
                var ln=lines[i];
                if (i === 0) layer.ctx.moveTo(ln.p0.x,ln.p0.y);
                else layer.ctx.lineTo(ln.p0.x,ln.p0.y);
                layer.ctx.lineTo(ln.p1.x,ln.p1.y);
            }
            layer.ctx.closePath();
            if ((fcol !== undefined) && (fcol !== null)) layer.ctx.fill();
            layer.ctx.stroke();
            layer.ctx.shadowBlur=0;
        }
    }

    function rectCenter(ly,cp,r,col,fcol,blur) {
        var rt={
            p0:{x:cp.x-r,y:cp.y-r},
            p1:{x:cp.x+r,y:cp.y-r},
            p2:{x:cp.x+r,y:cp.y+r},
            p3:{x:cp.x-r,y:cp.y+r}
        };
        rect(ly,rt,col,fcol,blur);
    }

    function rects(ly,r,col) {
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
            for(var i=0;i < lines.length;i++) {
                var ln=lines[i];
                if (i === 0) layer.ctx.moveTo(ln.p0.x,ln.p0.y);
                else layer.ctx.lineTo(ln.p0.x,ln.p0.y);
                layer.ctx.lineTo(ln.p1.x,ln.p1.y);
            }
            layer.ctx.strokeStyle=col;
            layer.ctx.closePath();
            layer.ctx.stroke();
        }
    }

    function getAbsXY(ly,p) {
        var layer=layers[ly];
        if (layer.mode === 0) {
            var x=p.x+p.y;
            var y=p.x-p.y;
            x*=layer.fldw;
            y*=layer.fldh;
            return {x: x,y:y};
        } else {
            return {x: p.x,y: p.y};
        }
    }

    function getMagXY(ly,p) {
        var layer=layers[ly];
        var res=getAbsXY(ly,p);
        if (layer.mode === 0) {
            res.x*=layer.mag;
            res.y*=layer.mag;
            res.y=layer.h-res.y;
        } else {
            res.x*=layer.mag;
            res.y*=layer.mag;
        }
//        return {x: ~~(res.x+.5),y: ~~(res.y+.5)};
        return res;
    }

    function calcLen(ly,len) {
        return len*layers[ly].mag;
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
            tx/=layer.mag;
            ty/=layer.mag;
            var x=tx;
            var y=ty;
            return {x: Math.round(x),y: Math.round(y)};
        }
    }

    function arrow(ly,p,d,len,col,fcol) {
        var s=coord.nextPoint(p,len,d);
        var s1=coord.nextPoint(p,~~(len/2),d+90);
        var s2=coord.nextPoint(p,~~(len/2),d-90);
        var pts=[p,s1,s,s2,p];
        polygon(ly,pts,col,fcol);
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

    function reCreateCanvas(ly,dim) {
        var layer=layers[ly];
        var contentDiv=layer.container;
        if ((layer.canvas !== null) && (!layer.hidden)) contentDiv.removeChild(layer.canvas);
        layer.canvas=document.createElement('canvas');
        if (layer.hidden) layer.canvas.style.visibility='hidden';
        layer.canvas.id=ly;
        layer.canvas.className='mapcanvas';
        if (!layer.hidden) contentDiv.appendChild(layer.canvas);
        layer.canvas.width=(dim === undefined ? layer.w : dim.h);
        layer.canvas.height=(dim === undefined ? layer.h : dim.h);
        layer.ctx = layer.canvas.getContext("2d");
    }

    function fitToViewport(ly,pdims,marg) {
        var layer=layers[ly];
        if (layer.fixed) return;
        if (pdims.topLeft === null) return;
        var cDiv=layer.container;
        var cstyle=window.getComputedStyle(cDiv);
        layer.w=parseInt(cstyle.width);
        layer.h=parseInt(cstyle.height);
        var dw=pdims.rightBottom.x-pdims.topLeft.x;
        var dh=pdims.rightBottom.y-pdims.topLeft.y;
        var magx=((layer.w-(marg*2))/dw)*2;
        var magy=((layer.h-(marg*2))/dh)*2;
        if (magx < magy) {
            layer.mag=Math.abs(magx);
        }
        else {
            layer.mag=Math.abs(magy);
        }
        layer.mx=layer.w/2;
        layer.my=-(layer.h/4.8);
        return layer;
    }


    function onresize() {
        var layerKeys=Object.keys(layers);
        for(var i=0;i < layerKeys.length;i++) {
	       	reCreateCanvas(layerKeys[i]);
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
        onresize();
    }

    function moveAllByPos(p) {
        var layerKeys=Object.keys(layers);
        for(var i=0;i < layerKeys.length;i++) {
            var ly=layerKeys[i];
            var layer=layers[ly];
            layer.mx+=p.x;
            layer.my+=p.y;
        }
        onresize();
    }


    function getDistance(ly,d) {
        var layer=layers[ly];
        return d*layer.mag;
    }

    function magPlus(ly,cp) {
    	var p=getInvXY(ly,cp);
        var pgp=getXY(ly,p);
        var layer=layers[ly];
        var lmag=layer.mag;
        layer.mag*=2;
        var gp=getXY(ly,p);
        layer.mx=layer.mx-(gp.x-pgp.x);
        layer.my=layer.my-(gp.y-pgp.y);
    }

    function magMinus(ly,cp) {
    	var p=getInvXY(ly,cp);
        var pgp=getXY(ly,p);
        var layer=layers[ly];
        var lmag=layer.mag;
        layer.mag/=2;
        var gp=getXY(ly,p);
        layer.mx=layer.mx-(gp.x-pgp.x);
        layer.my=layer.my-(gp.y-pgp.y);
    }

    function magPlusAll(cp) {
        var layerKeys=Object.keys(layers);
        for(var i=0;i < layerKeys.length;i++) {
            magPlus(layerKeys[i],cp);
        }
    }

    function magMinusAll(cp) {
        var layerKeys=Object.keys(layers);
        for(var i=0;i < layerKeys.length;i++) {
            magMinus(layerKeys[i],cp);
        }
    }

    function fitToViewports(r,marg,vp) {
        var layerKeys=Object.keys(layers);
        for(var i=0;i < layerKeys.length;i++) fitToViewport(layerKeys[i],r,marg,vp);
    }

    function canvasToImage(ly) {
        var layer=layers[ly];
        return layer.canvas.toDataURL("image/png;base64;");
    }

    function removeCanvas(ly) {
        var layer=layers[ly];
        if (layer.canvas !== null) layer.canvas.parentNode.removeChild(layer.canvas);
        layer.canvas=null;
        layer.ctx=0;
    }

    function getLayer(ly) {
        return layers[ly];
    }

    function addLayer(name,ldata) {
        layers[name]=ldata;
    }

    function addDefaultLayer(cont,name,hidden) {
        addLayer(name,{fldh:0.5,fldw:1,w:0,h:0,mag:1,mx:0,my:0,mode:0,canvas : null,ctx : null,container : cont,hidden: hidden === undefined ? false : hidden});
    }


    function getObjectId(ly,gp) {
        var layer=getLayer(ly);
        var pixelData=layer.ctx.getImageData(gp.x, gp.y, 1,1).data;
        var rgb={r:pixelData[0],g:pixelData[1],b:pixelData[2]};
        return rgbToId(rgb);
    }


    function getMousePos(ly,e) {
        var layer=getLayer(ly);
        var obj = layer.canvas;
        var top=0;
        var left=0;
        while (obj.tagName !== 'BODY') {
            top+=obj.offsetTop;
            left+=obj.offsetLeft;
            obj=obj.offsetParent;
        }
        var mouseX = e.clientX - left + window.pageXOffset;
        var mouseY = e.clientY - top + window.pageYOffset;
        return {x: mouseX,y: mouseY};
    }


    function destruct() {
        var layerKeys=Object.keys(layers);
        for(var i=0;i < layerKeys.length;i++) {
            var layer=layers[layerKeys[i]];
            var contentDiv=layer.container;
            if ((layer.canvas !== null) && (!layer.hidden)) contentDiv.removeChild(layer.canvas);
        }
        layers={};        
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
            var ret={x: ~~(x+.5),y: ~~(y+.5)};
            return ret;
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


    return {
        getTextDim : getTextDim,
        getFloatTextDim : getFloatTextDim,
        destruct: destruct,
        rgbToHex : rgbToHex,
        hexToRgb: hexToRgb,
        idToRgb : idToRgb,
        rgbToId : rgbToId,
        rgbToFn : rgbToFn,
        rgbaToFn : rgbaToFn,
        getObjectId : getObjectId,
        getMousePos : getMousePos,
        addLayer : addLayer,
        addDefaultLayer : addDefaultLayer,
        getLayer : getLayer,
        removeCanvas : removeCanvas,
        canvasToImage : canvasToImage,
        reCreateCanvas : reCreateCanvas,
        componentToHex : componentToHex,
        mode : mode,
        onresize : onresize,
        clear : clear,
        magPlus : magPlus,
        magPlusAll : magPlusAll,
        magMinus : magMinus,
        magMinusAll : magMinusAll,
        getDistance : getDistance,
        moveByPos : moveByPos,
        moveAllByPos : moveAllByPos,

        calcLen : calcLen,

        glass : glass,
        init : init,
        getXY : getXY,
        getXYZ : getXYZ,
        getAbsXYZ: getAbsXYZ,
        fitToViewport : fitToViewport,
        fitToViewports : fitToViewports,
        drawSprite : drawSprite,
        getInvXY : getInvXY,
        polygon : polygon,
        line : line,
        lineW : lineW,
        rect : rect,
        rects : rects,
        rectCenter: rectCenter,
        drawText : drawText,
        drawFloatText : drawFloatText,
        inRect : inRect,
        cross : cross,
        crossp : crossp,
        putImage :  putImage,
        arc: arc,
        ellipse: ellipse,
        circle : circle,
        arrow : arrow
    };

})();



