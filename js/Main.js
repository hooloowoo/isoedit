
var main = (function () {

    function onresize() {
        canvasView.onresize();
    }

    function init() {
        divContainer=document.getElementById('content');
        toolBarView.init(document.getElementById('toolbar'));
        editBarView.init(document.getElementById('editbar'));
        hidService.init(divContainer);
        animService.init();
        canvasView.init(divContainer,function() {
            meshService.init();
            onresize();
        });
    }

    return {
        init : init,
        onresize : onresize
    };

})();

