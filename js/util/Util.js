var util = (function() {

    var timeDiff=0;

    function crea(typ,id,pdiv,cls) {
        var ret=document.createElement(typ);
        if ((id !== undefined) && (id !== null)) ret.id=id;
        if (cls !== undefined) ret.className=cls;
        if (pdiv !== undefined) pdiv.appendChild(ret);
        return ret;
    }

    function inpTime(id,pdiv,cls) {
        var ret=document.createElement('input');
        ret.type='time';
        if ((id !== undefined) && (id !== null)) ret.id=id;
        if (cls !== undefined) ret.className=cls;
        if (pdiv !== undefined) pdiv.appendChild(ret);
        return ret;
    }

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

    function val(id,val) {
        var elem=document.getElementById(id);
        if (elem.type === 'checkbox') elem.checked=val;
        else {
            if (val !== undefined) elem.value=val;
            return elem.value;
        }
    }

    function ihtml(id,val) {
        var elem=document.getElementById(id);
        if (val !== undefined) elem.innerHTML=val;
        return elem.innerHTML;
    }

    function getActTime() {
        var ret=(new Date()).getTime();
        ret+=timeDiff;
        return ret;
    } 


    function addJs(name) {
        var sc=document.createElement('script');
        sc.src=name;
        document.body.appendChild(sc);
    }

    function getISOTime(t) {
        var date = new Date(t);
        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)+'.'+(t%1000);
        return formattedTime;
    }

    function getISODatetime(t) {
        var date = new Date(t);
        var years = date.getFullYear();
        var months = "0" + (date.getMonth()+1);
        var days = "0" + date.getDate();
        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = ''+ years + '.' + months.substr(-2) + '.' + days.substr(-2) + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)+'.'+(t%1000);
        return formattedTime;
    }


    function utf8decode(utf) {
        var ret = utf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,
            function(c) {
                var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
                return String.fromCharCode(cc); }
        );
        ret = utf.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g,
            function(c) {
                var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
                return String.fromCharCode(cc); }
        );
        return ret;
    }



    function doGet(url, handler) {
      var receiveReq = (function () {
          if (window.XMLHttpRequest)
              return new XMLHttpRequest(); //Not IE
          else if (window.ActiveXObject)
              return new ActiveXObject("Microsoft.XMLHTTP"); //IE
          else
              alert("Your browser doesn't support the XMLHttpRequest object.");
      })();
        if (receiveReq.readyState === 4 || receiveReq.readyState === 0) {
            receiveReq.open("GET", url, true);
//            console.log(url);
            receiveReq.onreadystatechange = function () {
                if ((receiveReq.readyState === 4) && (receiveReq.status == 200)) {
//                    var txt = utf8decode(atob(receiveReq.responseText));
                    var txt = utf8decode(receiveReq.responseText);
                    if (handler !== undefined) {
                        handler(url, txt);
                    } else {
                        handleAjax(url, txt);
                    }
                }
            };
            receiveReq.send(null);
        } else {
            console.log("receiveReq.readyState:" + receiveReq.readyState);
            setTimeout(function () {
                doGet(url,handler);
            }, 1000);
        }
        return receiveReq;
    }

    function doPost(url,payload, handler) {
      var receiveReq = (function () {
          if (window.XMLHttpRequest)
              return new XMLHttpRequest(); //Not IE
          else if (window.ActiveXObject)
              return new ActiveXObject("Microsoft.XMLHTTP"); //IE
          else
              alert("Your browser doesn't support the XMLHttpRequest object.");
      })();
        if (receiveReq.readyState === 4 || receiveReq.readyState === 0) {
            receiveReq.open("POST", url, true);
            receiveReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            receiveReq.onreadystatechange = function () {
                if ((receiveReq.readyState === 4) && (receiveReq.status == 200)) {
                    var txt = utf8decode(receiveReq.responseText);
                    if (handler !== undefined) {
                        handler(url, txt);
                    } else {
                        handleAjax(url, txt);
                    }
                }
            };
            receiveReq.send(payload);
        } else {
            console.log("receiveReq.readyState:" + receiveReq.readyState);
            setTimeout(function () {
                doPost(url,payload,handler);
            }, 1000);
        }
    }


    function updateTime(systime) {
        var ret=(new Date()).getTime();
        timeDiff=systime-ret;
    }

    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
    }


    return {
        addJs : addJs,
        uuidv4 : uuidv4,
        doGet : doGet,
        doPost : doPost,
        updateTime : updateTime,
        getISODatetime : getISODatetime,
        getISOTime : getISOTime,
        getActTime : getActTime,
        val : val,
        ihtml : ihtml,
        inpTime: inpTime,
        urlParams : urlParams,
        frame : frame,
        centerDiv : centerDiv,
        submit : submit,
        inputrow :  inputrow,
        adiv : adiv,
        adivhtml : adivhtml,
        MAX_LONG: 9223372036854776000,
        crea : crea
    };

})();
