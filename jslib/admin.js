var admin = (function() {


    var ajaxReq = getXMLHttpRequestObject();

    function getXMLHttpRequestObject() {
        if (window.XMLHttpRequest) return new XMLHttpRequest(); //Not IE
        else if(window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP"); //IE
        else alert("Your browser doesn't support the XMLHttpRequest object.");
    }

 

    function upload() {
        var divCont=util.frame('uploadframe','Upload');
        var divMessage=util.adiv(divCont,'message','wmessage');
        var divInputs=util.adiv(divCont,'regframe','winput');
        

        var form=document.createElement('form');form.id='file-form';form.method='POST';form.action='/php/save.php?app=main';
        divInputs.appendChild(form);
        var inpFile=document.createElement('input');inpFile.type='file';inpFile.id='file-select';inpFile.name='photos[]';inpFile.multiple=true;
        form.appendChild(inpFile);
        var btnSubmit=document.createElement('button');btnSubmit.type='submit';btnSubmit.id='upload-button';btnSubmit.innerHTML='Upload';
        form.appendChild(btnSubmit);
        form.onsubmit = function(event) {
            event.preventDefault();
            btnSubmit.innerHTML = 'Uploading...';
            var files=inpFile.files;
            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
//              if (!file.type.match('image.*')) {
//                continue;
//              }
                formData.append('files[]', file, file.name);
            }
            ajaxReq.open('POST', '/php/admin.php', true);
            ajaxReq.onload = function () {
                if (ajaxReq.status === 200) {
                    btnSubmit.innerHTML = 'Upload';
                } else {
                    alert('An error occurred!');
                }
            };
            ajaxReq.send(formData);
        }        
        var divFrame=document.getElementById('uploadframe');
        util.centerDiv(divFrame);
    }

    function onResize() {
        var fr=document.getElementById('uploadframe');
        if (fr !== null) util.centerDiv(fr);
    }


    function show() {
        upload();
    }

    return {
    	onResize : onResize,
        show : show,
        upload: upload
    };

})();



