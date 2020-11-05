var win = (function() {
    var wins=[];
    var tray=null;


    function add(id,title,rsFn) {
        for(var i=0;i < wins.length;i++) {
            if (wins[i].id === id) {
                show(id);
                return wins[i];
            }
        }
        var wodiv=util.adiv(tray,id,'windowopaq');
        var wdiv=util.adiv(tray,id,'window');
        wdiv.appendChild(wodiv);
        var trow=util.adiv(wdiv,id+'_trow','wtitle');
        util.adivhtml(trow,id+'_tit','wtitletext',title);
        var cldiv=util.adiv(trow,id+'_c','wclose');cldiv.innerHTML='x';cldiv.onclick=hidewindow;
        var wcont=util.adiv(wdiv,id+'_cont','wcont');
        var trow=util.adiv(wdiv,id+'_wresize','wresize');
        wdiv.onmousedown = function(e) {mouseDown(e);}; 
        var wdesc={div : wdiv,cont : wcont, id : id,rsFn : rsFn,odiv : wodiv};
        wins.push(wdesc);
        return wdesc;
    }
    
    function getWindowDiv(d) {
        var obj=d;
        for(var i=0;i < 100;i++) { // safe loop
            if (obj === undefined) break;
            if (obj === null) break;
            if (obj.className === 'window') return obj;
            obj=obj.parentNode;
        }
    }

    function getTitle(d) {
        var obj=d;
        for(var i=0;i < 100;i++) { // safe loop
            if (obj === null) return;
            if (obj.className === 'wtitle') return obj;
            obj=obj.parentNode;
        }
    }

    var mseStat=0;
    var msePos={};
    var mseElement=null;
    var mseSize=true;
    var mseMove=false;

    function isSizeRect(e) {
        var rsw=24;
        var wdiv=getWindowDiv(e.target);
        if(wdiv !== undefined) {
            var blpos={x: wdiv.offsetLeft+wdiv.offsetWidth,y: wdiv.offsetTop+wdiv.offsetHeight};
            return ((e.clientX > blpos.x-rsw) && (e.clientX < blpos.x) && (e.clientY > blpos.y-rsw) && (e.clientY < blpos.y))
        }
    }

    function mouseDown(e) {
        var src=e.target;
        var ttDiv=getTitle(src);
        if (ttDiv !== undefined) {
            mseSize=false;
            mseMove=true;
        } else {
            mseMove=false;
            mseSize=isSizeRect(e);
        }
        mseElement=getWindowDiv(src);
        mseStat=1;
        msePos.x=e.clientX;
        msePos.y=e.clientY;
        document.addEventListener("mouseup", mouseUp, false);        
    }

    function mouseUp(e) {
        document.removeEventListener("mouseup", mouseUp, false);        
        mseStat=0;
        mseElement=null;
    }

    function mouseMove(e) {
        var src=e.target;
        if (mseStat === 1) {
            var dx=e.clientX-msePos.x;
            var dy=e.clientY-msePos.y;
            if (mseElement !== null) {
                if (mseMove) {
                    var x=parseInt(mseElement.offsetLeft);
                    var y=parseInt(mseElement.offsetTop);
                    var nx=(x+dx);
                    var ny=(y+dy);
                    mseElement.style.left=""+nx+"px";
                    mseElement.style.top=""+ny+"px";
                } else if (mseSize) {
                    var cstyle=window.getComputedStyle(mseElement);
                    var cw=parseInt(cstyle.width);
                    var ch=parseInt(cstyle.height);
                    var w=parseInt(mseElement.offsetWidth);
                    var h=parseInt(mseElement.offsetHeight);
                    var nx=(cw+dx);
                    var ny=(ch+dy);
                    mseElement.style.width=""+nx+"px";
                    mseElement.style.height=""+ny+"px";
                    var wdiv=getWindowDiv(e.target);
                    if (wdiv !== undefined) {
                        var cont=seek(wdiv.id);
                        if (cont.rsFn !== undefined) cont.rsFn();
                        var wdiv=mseElement.querySelector('.windowopaq');
                        wdiv.style.width=""+nx+"px";
                        wdiv.style.height=""+(dy+y)+"px";
                    }
                }
            }
            msePos.x=e.clientX;
            msePos.y=e.clientY;
        } else {
        }
    }


    function init(pTray) {
        document.removeEventListener("mousemove", mouseMove, false);        
        document.addEventListener("mousemove", mouseMove, false);        
        tray=(pTray === undefined ? document.body : pTray);
    }
    
    function seek(id,rsFn) {
        for(var i=0;i < wins.length;i++) {
            if (wins[i].id === id) return wins[i];
        }
        return add(id,rsFn);
    }

    function show(id) {
        var w=seek(id);
        w.div.style.display="inherit";
        return w;
    }

    function center(id) {
        var w=seek(id);
        util.centerDiv(w.div);
        util.centerDiv(w.div);
    }



    function hide(id) {
        var wd=seek(id);
        wd.div.style.display="none";
        return wd;
    }

    
    function hidewindow(e) {
        var src=e.target;
        var cid=src.id;
        var wid=cid.substring(0,cid.length-2);
        var w=seek(wid);
        if ((w.onClose !== undefined) && (w.onClose !== null)) w.onClose();
        w.div.style.display="none";
    }

    function onResize() {
    }
    
    return {
        init : init,
        center : center,
        add :add,
        hide : hide,
        seek : seek,
        show: show,
        onResize : onResize
    };

})();



