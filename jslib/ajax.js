var ajax = (function () {
    var receiveReq = (function () {
        if (window.XMLHttpRequest)
            return new XMLHttpRequest(); //Not IE
        else if (window.ActiveXObject)
            return new ActiveXObject("Microsoft.XMLHTTP"); //IE
        else
            alert("Your browser doesn't support the XMLHttpRequest object.");
    })();

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
        if (receiveReq.readyState === 4 || receiveReq.readyState === 0) {
            receiveReq.open("GET", url, true);
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
    }


    function doPost(url,payload, handler) {
        if (receiveReq.readyState === 4 || receiveReq.readyState === 0) {
            receiveReq.open("POST", url, true);
            receiveReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");            
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
            receiveReq.send(payload);
        } else {
            console.log("receiveReq.readyState:" + receiveReq.readyState);
            setTimeout(function () {
                doPost(url,payload,handler);
            }, 1000);
        }
    }

    // Debug
    function handleAjax(url, txt) {
        console.log(url,txt);
    }

    return {
        doGet: doGet,
        doPost: doPost
    };

})();
