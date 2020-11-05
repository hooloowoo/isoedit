var list = (function () {

    var lst=[];

    function list() {
        ajax.doGet('/php/crud.php?m=i&app=obj',function(url, txt) {
            lst=JSON.parse(txt);
            repaint();
        });
    }


    function load(id) {
        ajax.doGet('/php/show.php?app=obj&id='+id,function(url, txt) {
            var dStr=atob(txt);
            localStorage.mobj3d=dStr;
            window.location.href='editor.html';
        });
    }


    function repaint() {
        var contentDiv=document.getElementById('itiles');
        contentDiv.innerHTML='';
        var divFrame=util.adiv(contentDiv,'','divFrame');
        var diviFrame=util.adiv(divFrame,'','divIFrame');


        for(var i=0;i < lst.length;i++) {
var iid=lst[i].id;
            var name=lst[i].name;
            var user=lst[i].user;
            var divRow=util.adiv(diviFrame,'lst_'+name,'listrow');
            var divName=util.adivhtml(divRow,'','lrname',name);
            var divEdit=util.adiv(divRow,'ed_'+iid,'lrbutton');
            var divDel=util.adiv(divRow,'del_'+iid,'lrbutton');
            if (user.name === login.getUserName()) {
                divEdit.innerHTML='Ed';
                divDel.innerHTML='Del';
                divEdit.onclick=function() {load(this.id.substring(3));};
                divDel.onclick=function() {del(this.id.substring(4));};
            }
        }

    }

    function onResize() {
    }

    function init() {
        m.init();
        list();
    }

    return {
        init : init,
        onResize : onResize
    };

})();
