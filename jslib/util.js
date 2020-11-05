var util = (function() {

    function adiv(pdiv,id,cls) {
        var div=document.createElement('div');
        if (cls !== undefined) div.className=cls;
        if ((id !== null) && (id !== "")) div.id=id;
        pdiv.appendChild(div);
        return div;
    }

    function adivhtml(pdiv,id,cls,ihtml) {
        var div=document.createElement('div');
        if (cls !== undefined) div.className=cls;
        if ((id !== null) && (id !== "")) div.id=id;
        pdiv.appendChild(div);
        div.innerHTML=ihtml;
        return div;
    }



    function inputrow(pdiv,id,label,itype) {
        var div=document.createElement('div');div.className='winputrow';pdiv.appendChild(div);
        var divLabel=document.createElement('div');
        div.appendChild(divLabel);divLabel.className='winputlabel';divLabel.innerHTML=label;
        var divInput=document.createElement('input');
        div.appendChild(divInput);divInput.className='winputcomp';
        divInput.id=id;
        if (itype !== undefined) divInput.type=itype;
        return div;
    }



    function submit(pdiv,id,label,callback) {
        var div=document.createElement('div');div.className='winputrow';pdiv.appendChild(div);
        var btn=document.createElement('button');
        div.appendChild(btn);btn.className='wsubmit';btn.innerHTML=label;
        if (callback !== undefined) btn.onclick=callback;
        return div;
    }


    function centerDiv(div) {
        var cstyle=window.getComputedStyle(div);
        var w=parseInt(cstyle.width);
        var h=parseInt(cstyle.height);
        div.style.left=((window.innerWidth-w)/2)+'px';
        div.style.top=((window.innerHeight-h)/2)+'px';
    }

    function frame(frname,title) {
//        var cont=document.getElementById('cont');
        var cont=document.body;
        var fr=document.getElementById(frname);
        if (fr !== null) cont.removeChild(fr);
        var divFrame=util.adiv(cont,frname,'wframe');
        var divTitle=util.adiv(divFrame,'title','wtitle');
        var divTitleLabel=util.adiv(divTitle,'titlelabel','wtitlelabel');divTitleLabel.innerHTML=title;
        var divTitleClose=util.adiv(divTitle,frname+'_close','wtitleclose');divTitleClose.innerHTML='X';
        divTitleClose.onclick=function(e) {
            var tname=e.target.id.substring(0,e.target.id.indexOf('_'));
            var cont=document.getElementById('cont');
            var fr=document.getElementById(tname);
            cont.removeChild(fr);
        };
        var divCont=util.adiv(divFrame,'framecontent','wcontent');
        return divCont;
    }


    function urlParams() {
        var params=[];
        var url=window.location.href;
        var pos=url.indexOf('?');
        if (pos > -1) {
            var pars=url.substring(pos+1).split("&");
            for(var i=0;i < pars.length;i++) {
                var par=pars[i];
                if (par.indexOf("=") > -1) {
                    var keyval=par.split("=");
                    var key=keyval[0];
                    var val=keyval[1];
                    params[key]=val;
                }
            }
        }
        return params;
    }     

    return {
        urlParams : urlParams,
        frame : frame,
        centerDiv : centerDiv,
        submit : submit,
        inputrow :  inputrow,
        adiv : adiv,
        adivhtml : adivhtml
    };

})();
