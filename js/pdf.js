var pdf = (function () {

    var pageWidth=800;
    var pageHeight=500;


    function init() {

    }




    function generateEx(trks) {
        var gtrks=genTracks(trks);
        var s="%PDF-1.4\n";
        s+="1 0 obj <</Type /Catalog /Pages 2 0 R>>\n"
        s+="endobj\n";
        s+="2 0 obj <</Type /Pages /Kids [3 0 R 7 0 R] /Count 2>>\n";
        s+="endobj\n";
        s+="3 0 obj<</Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 "+pageWidth+" "+pageHeight+"] /Contents 6 0 R>>\n";
        s+="endobj\n";
        s+="4 0 obj<</Font <</F1 5 0 R>>>>\n";
        s+="endobj\n";
        s+="5 0 obj<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\n";
        s+="endobj\n";
        s+="6 0 obj\n";
        s+="<</Length "+(64+1+gtrks.length)+">>\n";
        s+="stream\n";
        s+="BT /F1 24 Tf 175 720 Td (Hello World!)Tj ET\n";
        s+="20 642 m 175 720 l S \n";
        s+=gtrks+"\n";        
        s+="endstream\n";
        s+="endobj\n";
        s+="7 0 obj<</Type /Page /Parent 2 0 R /MediaBox [0 0 500 800] /Contents 8 0 R>>\n";
        s+="endobj\n";
        s+="8 0 obj\n";
        s+="<</Length 61>>\n";
        s+="stream\n";
        s+="0.9 0.5 0.0 rg 175 720 m 175 500 l 300 800 400 600 v 100 650 50 75 re f h S 0.1 0.9 0.5 rg Q\n";
        s+="endstream\n";
        s+="endobj\n";
        s+="xref\n";
        s+="0 9\n";
        s+="0000000000 65535 f\n";
        s+="0000000009 00000 n\n";
        s+="0000000056 00000 n\n";
        s+="0000000111 00000 n\n";
        s+="0000000212 00000 n\n";
        s+="0000000250 00000 n\n";
        s+="0000000317 00000 n\n";
        s+="0000000408 00000 n\n";
        s+="0000000508 00000 n\n";
        s+="trailer <</Size 9/Root 1 0 R>>\n";
        s+="startxref\n";
        s+="406\n";
        s+="%%EOF\n";
        var ds="data:application/pdf;base64," + btoa(s);
        window.open(ds, '_blank');
    }


    function test() {
        var s="%PDF-1.4\n";
        s+="1 0 obj <</Type /Catalog /Pages 2 0 R>>\n"
        s+="endobj\n";
        s+="2 0 obj <</Type /Pages /Kids [3 0 R 7 0 R] /Count 2>>\n";
        s+="endobj\n";
        s+="3 0 obj<</Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 500 800] /Contents 6 0 R>>\n";
        s+="endobj\n";
        s+="4 0 obj<</Font <</F1 5 0 R>>>>\n";
        s+="endobj\n";
        s+="5 0 obj<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\n";
        s+="endobj\n";
        s+="6 0 obj\n";
        s+="<</Length 64>>\n";
        s+="stream\n";
        s+="BT /F1 24 Tf 175 720 Td (Hello World!)Tj ET\n";
        s+="20 642 m 175 720 l S \n";
        s+="endstream\n";
        s+="endobj\n";
        s+="7 0 obj<</Type /Page /Parent 2 0 R /MediaBox [0 0 500 800] /Contents 8 0 R>>\n";
        s+="8 0 obj\n";
        s+="<</Length 61>>\n";
        s+="stream\n";
        s+="0.9 0.5 0.0 rg 175 720 m 175 500 l 300 800 400 600 v 100 650 50 75 re f h S 0.1 0.9 0.5 rg Q\n";
        s+="endstream\n";
        s+="endobj\n";
        s+="xref\n";
        s+="0 9\n";
        s+="0000000000 65535 f\n";
        s+="0000000009 00000 n\n";
        s+="0000000056 00000 n\n";
        s+="0000000111 00000 n\n";
        s+="0000000212 00000 n\n";
        s+="0000000250 00000 n\n";
        s+="0000000317 00000 n\n";
        s+="0000000408 00000 n\n";
        s+="0000000508 00000 n\n";
        s+="trailer <</Size 9/Root 1 0 R>>\n";
        s+="startxref\n";
        s+="406\n";
        s+="%%EOF\n";
        var ds="data:application/pdf;base64," + btoa(s);
        console.log(ds);
        window.location.href=ds;

    }


    function circle(p,r,dd) {
        var rp={x:0,y:0};
        rp.x=dd.marg+((p.x-dd.x)*dd.mag);
        rp.y=pageHeight-(dd.marg+(p.y*dd.mag));
        rr=(r*dd.mag);
        var ret=''+(rp.x)+' '+(rp.y+rr)+' m ';
        ret+=''+(rp.x+rr)+' '+(rp.y+rr)+' '+(rp.x+rr)+' '+(rp.y)+' '+(rp.x+rr)+' '+(rp.y)+' c '; 
        ret+=''+(rp.x+rr)+' '+(rp.y)+' '+(rp.x+rr)+' '+(rp.y-rr)+' '+(rp.x)+' '+(rp.y-rr)+' c '; 
        ret+=''+(rp.x)+' '+(rp.y-rr)+' '+(rp.x-rr)+' '+(rp.y-rr)+' '+(rp.x-rr)+' '+(rp.y)+' c '; 
        ret+=''+(rp.x-rr)+' '+(rp.y)+' '+(rp.x-rr)+' '+(rp.y+rr)+' '+(rp.x)+' '+(rp.y+rr)+' c '; 

        ret+=' S ';
        return ret;
    }


    function line(l,dd) {
        var rl={p0:{x:0,y:0},p1:{x:0,y:0}};
        rl.p0.x=dd.marg+((l.p0.x-dd.x)*dd.mag);
        rl.p0.y=pageHeight-(dd.marg+((l.p0.y-dd.y)*dd.mag));
        rl.p1.x=dd.marg+((l.p1.x-dd.x)*dd.mag);
        rl.p1.y=pageHeight-(dd.marg+((l.p1.y-dd.y)*dd.mag));

        var ret=''+rl.p0.x+' '+rl.p0.y+' m '+rl.p1.x+' '+rl.p1.y+' l S ';
       	return ret;
    }

    function textRot(pd) {
        var d=pd*Math.PI/180;
        var ret=''+Math.cos(d)+' '+(-Math.sin(d))+' '+Math.sin(d)+' '+Math.cos(d)+' ';
        return ret;
    }

    function text(txt,dd) {
        var p={};
        p.x=dd.marg+((txt.p.x-dd.x)*dd.mag);
        p.y=pageHeight-(dd.marg+((txt.p.y-dd.y)*dd.mag));
        var size="10";
//        var ret="BT /F1 "+size+" Tf 0 1 1 0 "+p.x+" "+p.y+" Tm ("+txt.text+")Tj ET\n";
        var ret="BT /F1 "+size+" Tf "+textRot(txt.d)+" "+p.x+" "+p.y+" Tm ("+txt.text+")Tj ET\n";

        return ret;
    }



    function genSlicePdf(p,cp,r,i,dd) {
        ret='';
        var sld=(360/p.slices.length);
        var dc=(sld*i)+p.shiftdeg;
        var d0=dc-(sld/2);
        var d1=dc+(sld/2);
        var pp0=coord.nextPoint(cp,r-(r*p.topp/100),d0);
        var pp1=coord.nextPoint(cp,r-(r*p.topp/100),d1);
        var ppc=coord.nextPoint(cp,r,dc);
        var cr=r*p.centerRadius/100;
        var sp0=coord.nextPoint(cp,cr,d0);
        var sp1=coord.nextPoint(cp,cr,d1);
        var txtp=coord.nextPoint(cp,cr+p.txtmarg,dc);
        ret+=line({p0:sp0,p1:pp0},dd);
        ret+=line({p0:sp1,p1:pp1},dd);
        ret+=line({p0:pp0,p1:ppc},dd);
        ret+=line({p0:pp1,p1:ppc},dd);
        ret+=circle(cp,cr,dd);

        if (p.slices[i].txt !== undefined) {
            var tdeg=((dc-90)+360)%360;
            if ((tdeg%90) === 0) tdeg+=1; 
            ret+=text({p:txtp, d:tdeg,text:p.slices[i].txt+''+(tdeg)},dd);
        }
        return ret;
    }

    function genPdf(pend) {
        var ret='';
        var dd={mag:1,x:0,y:0,marg:20};
        dd.mag=(pageHeight-(dd.marg*2))/pageHeight;
        var lydims={w:pageWidth,h:pageHeight,cp: {x: ~~(pageWidth/2),y:~~(pageHeight/2)}};
        var r=parseInt((lydims.w > lydims.h ? lydims.h : lydims.w)/2);
//        gui.circle('canvas',lydims.cp,r,'#8FB8BF');
        for(var i=0;i < pend.slices.length;i++) ret+=genSlicePdf(pend,lydims.cp,r,i,dd);
        return ret;
    }

/*

        var trk=map.tracks;
        var ret='';
        var dims=mMap.getRect();
        var dd={mag:1,marg:20,x: dims.topLeft.x,y:dims.topLeft.y};

        var vpw=(pageWidth-(2*dd.marg));
        var vph=(pageHeight-(2*dd.marg));
        var mw=(Math.abs(dims.rightBottom.x-dims.topLeft.x));
        var mh=(Math.abs(dims.rightBottom.y-dims.topLeft.y));
        var magx=vpw/mw;
        var magy=vph/mh;
        if (magx < magy) {
            dd.mag=magx;
            var rh=vph/dd.mag;
            dd.y-=((rh-mh)/2);
        } else {
            dd.mag=magy;    
            var rw=vpw/dd.mag;
            dd.x-=((rw-mw)/2);
        }


        for(var i=0;i < map.polygons.length;i++) {
            var poly=map.polygons[i];
            var lp=null;
            for(var j=0;j < poly.points.length;j++) {
                var p=poly.points[j];
                if (lp !== null) ret+=line({p0: lp,p1:p},dd);
                lp=p;
            }
            ret+=line({p0: lp,p1:poly.points[0]},dd);
        }

        for(var i=0;i < map.texts.length;i++) {
            ret+=text(map.texts[i],dd);
        }


        var trks=map.tracks;
        for(var i=0;i < trks.length;i++) ret+=genTrack(trks[i],dd);
        return ret;
    }

*/
    function generate(pend) {
        var gpdf=genPdf(pend);
        var s="%PDF-1.4\n";
        s+="1 0 obj <</Type /Catalog /Pages 2 0 R>>\n"
        s+="endobj\n";
        s+="2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>>\n";
        s+="endobj\n";
        s+="3 0 obj<</Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 "+pageWidth+" "+pageHeight+"] /Contents 6 0 R>>\n";
        s+="endobj\n";
        s+="4 0 obj<</Font <</F1 5 0 R>>>>\n";
        s+="endobj\n";
        s+="5 0 obj<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\n";
        s+="endobj\n";
        s+="6 0 obj\n";
        s+="<</Length "+(64+1+gpdf.length)+">>\n";
        s+="stream\n";
        s+="BT /F1 24 Tf 175 720 Td (Hello World!)Tj ET\n";
        s+="20 642 m 175 720 l S \n";
        s+="0.50 w \n"; // width of line
        s+=gpdf+"\n";        
        s+="endstream\n";
        s+="endobj\n";
        s+="xref\n";
        s+="0 6\n";
        s+="0000000000 65535 f\n";
        s+="0000000009 00000 n\n";
        s+="0000000056 00000 n\n";
        s+="0000000111 00000 n\n";
        s+="0000000212 00000 n\n";
        s+="0000000250 00000 n\n";
        s+="0000000320 00000 n\n";
        s+="trailer <</Size 9/Root 1 0 R>>\n";
        s+="startxref\n";
        s+="406\n";
        s+="%%EOF\n";
        var ds="data:application/pdf;base64," + btoa(s);
        window.open(ds, '_blank');
    }


    return {
        init : init,
        test : test,
        generate : generate
    };

})();

