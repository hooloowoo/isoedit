var animService = (function() {

    var animHandlers=[];

    window.requestAnimFrame = function(){
        return (
            window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback) {
                setTimeout(callback, 1000/30); // If not implemented.
            }
        );
    }();

    function init() {
        tick();
    }

    function tick() {
        requestAnimFrame(tick);
        for(var i=0;i < animHandlers.length;i++) {
            animHandlers[i]();
        }
    }

    function init() {
        console.log("AnimService init");
        tick();
    }

    function addAnimHandler(fn) {
        animHandlers.push(fn);
        return fn;
    }

    function removeAnimHandler(fn) {
        var idx=animHandlers.indexOf(fn);
        if (idx > -1) animHandlers.splice(idx,1);
        return fn;
    }

    return {
        init: init,
        addAnimHandler: addAnimHandler,
        removeAnimHandler: removeAnimHandler
    };

})();
