var crud = (function () {

    function save(name,mime,data,thumbnail,app,fn) {
        var adata=btoa(data);
        var url='/php/crud.php?m=s&t=ajax&app='+app+'&fname='+name+'&ftype='+mime;
        ajax.doPost(url,'data='+encodeURIComponent(adata)+'&thumbnail='+encodeURIComponent(thumbnail),function() {
            if (fn === undefined) alert(fname+' saved.');
            else fn();
        });
    }


    function load(name,app,fn) {
        ajax.doGet('/php/show.php?app='+app+'&n='+name,function(url, txt) {
            var dStr=atob(txt);
            localStorage.pend=dStr;
            fn(dStr);
        });
    }

    function remove(name,app,fn) {
        var url='/php/crud.php?m=d&app='+app+'&fname='+name;
        ajax.doGet(url,function(url, txt) {
            if (fn === undefined) alert(fname+' removed.');
            else fn(txt);
        });
    }  

    function list(app,fn) {
        ajax.doGet('/php/crud.php?m=i&app='+app,function(url, txt) {
            fn(txt);
        });
    }

    return {
        list : list,
        save : save,
        remove : remove,
        load : load
    };

})();
