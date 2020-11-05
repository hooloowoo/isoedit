var coord = (function () {


    function samePoint(p0,p1) {
        return ((p0.x == p1.x) && (p0.y == p1.y));
    }

    function isPointOnLine(p,l) {
        var lp0=l.p0;
        var lp1=l.p1;
        var c1;
        var c2;
        var dlx=lp1.x-lp0.x;
        var dly=lp1.y-lp0.y;
        var dpx=lp1.x-lp0.x;
        var dpy=lp1.y-lp0.y;

        if (fequ(dpx,0) && fequ(dpy,0)) {
            c1=c2=1;
        } else if (!fequ(dpy,0)) {
            c1=dpx/dpy;
            c2=dlx/dly;
        } else {
            c1=dpy/dpx;
            c2=dly/dlx;
        }

        var result=fequ(c1,c2) &&
            (
/*
                ((p.x >= lp0.x) && (p.y >= lp0.y) && (p.x <= lp1.x) && (p.y <= lp1.y)) ||
                ((p.x >= lp1.x) && (p.y >= lp1.y) && (p.x <= lp0.x) && (p.y <= lp0.y)) ||
                ((p.x >= lp0.x) && (p.y <= lp0.y) && (p.x <= lp1.x) && (p.y >= lp1.y)) ||
                ((p.x <= lp0.x) && (p.y >= lp0.y) && (p.x >= lp1.x) && (p.y <= lp1.y))
                */
                (fgte(p.x,lp0.x) && fgte(p.y,lp0.y) && flte(p.x,lp1.x) && flte(p.y,lp1.y)) ||
                (fgte(p.x,lp1.x) && fgte(p.y,lp1.y) && flte(p.x,lp0.x) && flte(p.y,lp0.y)) ||
                (fgte(p.x,lp0.x) && flte(p.y,lp0.y) && flte(p.x,lp1.x) && fgte(p.y,lp1.y)) ||
                (flte(p.x,lp0.x) && fgte(p.y,lp0.y) && fgte(p.x,lp1.x) && flte(p.y,lp1.y))
            );
        return result;
    };
            
    function isPointOnArc(p,cp,r,sd,ed) {
        var cr=calcLen({p0: p,p1: cp});
        if (!fequ(cr,r)) return false;
        var ssd=(sd+360)%360;
        var sed=(ed+360)%360;
        var d=(calcDeg({p0: cp,p1: p})+360)%360;
        if (ssd > sed) {
            sed+=360;
            if (d < ssd) d=(d%360)+360;
        }
        if ((d >= ssd) && (d <= sed)) return true;
        return false;
    };


    function intersectOfLines(l0,l1) {
        var res=intersect(parseInt(l0.p0.x), parseInt(l0.p0.y), parseInt(l0.p1.x), parseInt(l0.p1.y), parseInt(l1.p0.x), parseInt(l1.p0.y), parseInt(l1.p1.x), parseInt(l1.p1.y));
        if (res !=null) {
            return res;
        }
    }


    function intersect(x1,y1,x2,y2,x3,y3,x4,y4) {
		var a1, a2, b1, b2, c1, c2;
		var r1, r2 , r3, r4;
		var denom, offset, num;

		a1 = y2 - y1;
		b1 = x1 - x2;
		c1 = (x2 * y1) - (x1 * y2);
		r3 = ((a1 * x3) + (b1 * y3) + c1);
		r4 = ((a1 * x4) + (b1 * y4) + c1);

		if ((r3 != 0) && (r4 != 0) && same_sign(r3, r4)) {
			return null;
		}

		a2 = y4 - y3;
		b2 = x3 - x4;
		c2 = (x4 * y3) - (x3 * y4);
		r1 = (a2 * x1) + (b2 * y1) + c2;
		r2 = (a2 * x2) + (b2 * y2) + c2;

		if ((r1 != 0) && (r2 != 0) && (same_sign(r1, r2))){
			return null;
		}
		denom = (a1 * b2) - (a2 * b1);

		if (denom == 0) {
            var m0=(y2-y1)/(x2-x1);
            var m1=(y4-y3)/(x4-x3);
            if (m0 === m1) {
                var pl=isPointOnLine({x: x1,y:y1},{p0:{x:x3,y:y3},p1:{x:x4,y:y4}});
                if (!pl) pl=isPointOnLine({x: x2,y:y2},{p0:{x:x3,y:y3},p1:{x:x4,y:y4}});
                if (!pl) pl=isPointOnLine({x: x3,y:y3},{p0:{x:x1,y:y1},p1:{x:x2,y:y2}});
                if (!pl) pl=isPointOnLine({x: x4,y:y4},{p0:{x:x1,y:y1},p1:{x:x2,y:y2}});
                if (!pl) {
                    return null;
                }
                else {
                    return {x: x1,y:y1};
                }
            }
            else return null;
        }

		if (denom < 0) { 
			offset = -denom / 2; 
		} 
		else {
			offset = denom / 2 ;
		}

		num = (b1 * c2) - (b2 * c1);
		if (num < 0){
			x = (num - offset) / denom;
		} 
		else {
			x = (num + offset) / denom;
		}

		num = (a2 * c1) - (a1 * c2);
		if (num < 0){
			y = ( num - offset) / denom;
		} 
		else {
			y = (num + offset) / denom;
		}
		return {x : x, y: y};
}


function same_sign(a,b){
  return (( a * b) >= 0);
}



  
    function intersectOfCircleAndLine(l, cp, r) {
        var lp0=l.p0;
        var lp1=l.p1;
        var dx=lp1.x-lp0.x;
        var dy=lp1.y-lp0.y;
        var A=(dx*dx)+(dy*dy);
        var B=2*(dx*(lp0.x - cp.x)+dy*(lp0.y - cp.y));
        var C=((lp0.x-cp.x)*(lp0.x-cp.x))+((lp0.y - cp.y)*(lp0.y - cp.y))-(r*r);
    	var det=(B*B)-(4*A*C);
        if ((A <= 0.0000001) || (det < 0)) {
            return false;
        }
        if (det === 0) {
            var t=-B/(2*A);
            var res0={x: lp0.x+t*dx,y: lp0.y+t*dy};
            var res1={x: lp0.x+t*dx,y: lp0.y+t*dy};
            return {p0 : res0,p1 : res1};
        }
        else {
            var t=((-B+Math.sqrt(det))/(2*A));
            var res0={x: lp0.x+t*dx,y: lp0.y+t*dy};
            t=((-B-Math.sqrt(det))/(2*A));
            var res1={x: lp0.x+t*dx,y: lp0.y+t*dy};
            return {p0 : res0,p1 : res1};
        }
    };
    


    function intersectOfCircles(p0, r0, p1, r1) {
        var dx=p1.x-p0.x;
        var dy=p1.y-p0.y;
        var d=Math.sqrt((dy*dy)+(dx*dx));
        if (d === 0) return false;
        if (d > (r0 + r1)) return false;
        if (d < Math.abs(r0 - r1)) return false;
        var a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;
        var x2 = p0.x + (dx * a/d);
        var y2 = p0.y + (dy * a/d);
        var h = Math.sqrt((r0*r0) - (a*a));
        var rx = -dy * (h/d);
        var ry = dx * (h/d);
        var xi = x2 + rx;
        var xi_prime = x2 - rx;
        var yi = y2 + ry;
        var yi_prime = y2 - ry;

        var res0={ x: xi, y: yi};
        var res1={x: xi_prime, y: yi_prime};
        return {p0 : res0, p1 : res1};
    };


    function calcDeg(l) {
        var dx=l.p1.x-l.p0.x;
        var dy=l.p1.y-l.p0.y;
        if ((dx == 0) && (dy == 0)) return;
        if (dx == 0) {
            if (dy < 0) return 0;
            if (dy > 0) return 180;
        }
        if (dy == 0) {
            if (dx < 0) return 270;
            if (dx > 0) return 90;
        }
        var dd=dy/dx;
        var deg=(Math.atan(dd)*180/Math.PI);
        deg=deg+90;
        if (dx < 0) deg=180+deg;
        return deg;
    }

    function calcLen(l) {
        var res=0;
        var dx=Math.abs(l.p1.x-l.p0.x);
        var dy=Math.abs(l.p1.y-l.p0.y);
        res=Math.sqrt((dx*dx)+(dy*dy));
        return res;
    }
    
    /*
     Calculate a perpendicular to line [l.p0.x,l.p0.y,l.p1.x,l.p1.y] form [l.p1.x,l.p1.y]
    */
    function perpendicular(l,len,dir) {
        var dx=(l.p1.x-l.p0.x);
        var dy=(l.p1.y-l.p0.y);
        if (len !== 0) {
            var olen=Math.sqrt(Math.abs(dx*dx)+Math.abs(dy*dy));
            var m=len/olen;
            dx*=m;
            dy*=m;
        }
        return {p0: {x : l.p1.x-(dy*dir), y : l.p1.y+(dx*dir)},p1 : l.p1};
    }
    
    /*
    Calculates the point from [x,y] in len distance and deg degree.
    */
    function nextPoint(p,len,deg) {
        var dr=Math.PI/180;
        var adeg=((deg+90)%360);
        var dx=len*Math.sin(adeg*dr);
        var dy=-len*Math.cos(adeg*dr);
        return {x : p.x+dy, y: p.y-dx};
    }



    /*
     Distance between a point [cx,cy] and a line [ax,ay,bx,by]
     return the distance and the neares point on the line.
    */
    function distPointFromLine(l,p) {
        var r_numerator = (p.x-l.p0.x)*(l.p1.x-l.p0.x) + (p.y-l.p0.y)*(l.p1.y-l.p0.y);
        var r_denomenator = (l.p1.x-l.p0.x)*(l.p1.x-l.p0.x) + (l.p1.y-l.p0.y)*(l.p1.y-l.p0.y);
        var r = r_numerator / r_denomenator;
	var px=l.p0.x + r*(l.p1.x-l.p0.x);
	var py=l.p0.y + r*(l.p1.y-l.p0.y);
	var s=((l.p0.y-p.y)*(l.p1.x-l.p0.x)-(l.p0.x-p.x)*(l.p1.y-l.p0.y) ) / r_denomenator;
	var d = Math.abs(s)*Math.sqrt(r_denomenator);
	var xx = px;
	var yy = py;
        if ( (r >= 0) && (r <= 1) ) {
	}
	else {
            var dist1 = (p.x-l.p0.x)*(p.x-l.p0.x) + (p.y-l.p0.y)*(p.y-l.p0.y);
            var dist2 = (p.x-l.p1.x)*(p.x-l.p1.x) + (p.y-l.p1.y)*(p.y-l.p1.y);
            if (dist1 < dist2)
            {
                xx = l.p0.x;
                yy = l.p0.y;
                d = Math.sqrt(dist1);
            }
            else
            {
                xx = l.p1.x;
                yy = l.p1.y;
                d = Math.sqrt(dist2);
            }
	}
	return {d : d, p : {x:xx,y:yy}};
    }
	
    function linesOfArch(cp,r,b,e)
    {
        var ret=[];
        if (b > e) e+=360;
        var lp=null;
        for(var i=b;i <= e;i++) {
            var np=nextPoint(cp,r,i);
            if (lp !== null) {
                ret.push({p0: lp,p1 : np});
            }
            lp=np;
        }
        return ret;
    }
    
    function calcArcLen(r,sd,ed) {
        var ssd=(sd+360)%360;
        var sed=(ed+360)%360;
        if (ssd > sed) sed+=360;
        var dd=Math.abs(sed-ssd);
        return (2*Math.PI*r)/(360/dd);
    };
    
    
    function calcMiddle(l) {
        var dx=(l.p1.x-l.p0.x)/2;
        var dy=(l.p1.y-l.p0.y)/2;
        return {p : {x : l.p0.x+dx,y : l.p0.y+dy},dp: {x : dx, y: dy}};
    }


    function crossingPointOfLines(l0,l1) {
        var x=-1;
        var y=-1;
        if ((l0.p1.x-l0.p0.x)*(l1.p1.y-l1.p0.y)-(l1.p1.x-l1.p0.x)*(l0.p1.y-l0.p0.y) != 0) {
            y=((l1.p0.x-l0.p0.x)*(l0.p1.y-l0.p0.y)*(l1.p1.y-l1.p0.y)+l0.p0.y*(l0.p1.x-l0.p0.x)*(l1.p1.y-l1.p0.y)-l1.p0.y*(l1.p1.x-l1.p0.x)*(l0.p1.y-l0.p0.y))/((l0.p1.x-l0.p0.x)*(l1.p1.y-l1.p0.y)-(l1.p1.x-l1.p0.x)*(l0.p1.y-l0.p0.y));
            if ((l0.p1.y-l0.p0.y) != 0) {
                x=((l0.p1.x-l0.p0.x)*(y-l0.p0.y)+l0.p0.x*(l0.p1.y-l0.p0.y))/(l0.p1.y-l0.p0.y);
            } else {
                x=((l1.p1.x-l1.p0.x)*(y-l1.p0.y)+l1.p0.x*(l1.p1.y-l1.p0.y))/(l1.p1.y-l1.p0.y);
            }
        }
        return {x:x,y:y};
    }

    function degreeOfLines(l0,l1) {
        var deg=0;
        var deg1=calcDeg(l0);
        var deg2=calcDeg(l1);
        return deg2-deg1;
    }

    function fequ(f0,f1) {
        var e=0.000001;
        return Math.abs(f0-f1) <= e;
    }

    function fgte(f0,f1) {
        if (fequ(f0,f1)) return true;
        return f0 > f1;
    }

    function flte(f0,f1) {
        if (fequ(f0,f1)) return true;
        return f0 < f1;
    }

    function calcLen3d(l) {
        var dlen=calcLen(l);
        var dz=Math.abs(l.p1.z-l.p0.z);
        var res=Math.sqrt((dlen*dlen)+(dz*dz));
        return res;
    }

    
    function flatXYZ(pp,cp,deg) {
        var ppd=coord.calcDeg({p0 : cp,p1 : pp});
        var ppl=coord.calcLen({p0 : cp,p1 : pp});
        var p=coord.nextPoint(cp,ppl,(ppd+deg)%360);
        return p;
    }

    function isPointInPoly(poly, pt) {
        for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
            && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
            && (c = !c);
        return c;
    }


/* ----   */
    function normalise2d3dVector(p) {
        var len = calcLen3d({p0:{x:0,y:0,z:0},p1:p});
        if (len == 0) return p;
        var np1={x: p.x/len, y:p.y/len, z:p.z/len};
        return np1;
    }


    function crossProduct3d( a, b ) {
        return {
            x: (a.y*b.z-a.z*b.y),
            y: (a.z*b.x-a.x*b.z),
            z: (a.x*b.y-a.y*b.x)};
    }

    function dotProduct3d( a, b ) {
        return a.x*b.x + a.y*b.y + a.z*b.z;
    }

    function subtract_vectors( a, b ) {
        return {
            x:a.x-b.x,
            y:a.y-b.y,
            z:a.z-b.z};
    }


    function getCosAngle3d(xyz,face) {
        var facet_normal = normalise2d3dVector(crossProduct3d(subtract_vectors(face.vertices[0],face.vertices[1]),subtract_vectors(face.vertices[1],face.vertices[2])));
        var direction_to_lightsource=normalise2d3dVector(subtract_vectors(xyz,face.vertices[0]));
        var cos_angle = dotProduct3d(direction_to_lightsource,facet_normal);
        return cos_angle;
    }



    return {
        flatXYZ : flatXYZ,
        getCosAngle3d : getCosAngle3d,
        calcLen3d : calcLen3d,
        fequ : fequ,
        isPointOnLine : isPointOnLine,
        calcArcLen : calcArcLen,
        isPointOnArc : isPointOnArc,
        nextPoint : nextPoint,
        calcLen : calcLen,
        calcDeg : calcDeg,
        perpendicular : perpendicular,
        linesOfArch : linesOfArch,
        intersectOfCircleAndLine : intersectOfCircleAndLine,
        intersectOfCircles : intersectOfCircles,
        intersectOfLines : intersectOfLines,
        calcMiddle : calcMiddle,
        samePoint : samePoint,
        degreeOfLines : degreeOfLines,
        crossingPointOfLines : crossingPointOfLines,
        distPointFromLine : distPointFromLine,
        isPointInPoly : isPointInPoly
    };
})();

