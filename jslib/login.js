var login = (function() {

  var lastStatus='';
  var username='';


    function register() {
        win.init();
        var wd=win.add('register','register');
        var divCont=util.adiv(wd.cont,'','logincont');
        var divMessage=util.adiv(divCont,'message','wmessage');
        var divInputs=util.adiv(divCont,'regframe','winput');
        util.inputrow(divInputs,'username','name');
        util.inputrow(divInputs,'password','password','password');
        util.inputrow(divInputs,'password2','password again','password');
        util.submit(divCont,'submit','Register',function() {onRegister();});
        util.centerDiv(document.getElementById('regframe'));
        win.center('register');
    }


    function login() {
        win.init();
        var wd=win.add('login','login');
        var divCont=util.adiv(wd.cont,'','logincont');

        var divMessage=util.adiv(divCont,'message','wmessage');
        var divInputs=util.adiv(divCont,'regframe','winput');
        util.inputrow(divInputs,'username','name');
        util.inputrow(divInputs,'password','password','password');
        util.submit(divCont,'submit','Login',function() {onLogin();});
        win.center('login');
    }



    function onResize() {
        var fr=document.getElementById('loginframe');
        if (fr !== null) util.centerDiv(fr);
        else {
          fr=document.getElementById('regframe');
          if (fr !== null) util.centerDiv(fr);
        }
        if (admin !== undefined) admin.onResize();
    }


    function onRegister() {
      var msg=document.getElementById('message');
      var name=document.getElementById('username').value;
      var pwd=document.getElementById('password').value;
      var pwd2=document.getElementById('password2').value;
      if (pwd !== pwd2) msg.innerHTML="Passwords are not equal.";
      regist(name,pwd);
    }

      function regist(name,pwd) {
        ajax.doPost("/php/login.php?c=r","mail="+name+"&pass="+pwd, function(url,txt) {
          lastStatus=txt;
          username=name;
          show();
          win.hide('register');
        });
      }


      function li(ul,href,title) {
        var li=document.createElement('li');
        var lia=document.createElement('a');lia.href=href;lia.innerHTML=title;li.appendChild(lia);ul.appendChild(li);

      }

      function show(callback) {
        var ul=document.getElementById("navmenu");
        ul.innerHTML='';
        li(ul,"/index.html","index");
        if ((lastStatus === 'LOGGED_IN') || (lastStatus === 'ALREADY_LOGGED_IN') || (lastStatus === 'REGISTERED')) {
          if (username === 'adm') li(ul,"javascript:admin.show()","admin");
          else li(ul,"/about.html","about");
          li(ul,"",username);
          li(ul,"javascript:login.logout()","logout");
        } else {
          li(ul,"/about.html","about");
          li(ul,"javascript:login.login()","login");
          li(ul,"javascript:login.register()","register");
        }
        if (callback !== undefined) callback();
      }


      function onLogin() {
      var name=document.getElementById('username').value;
      var pwd=document.getElementById('password').value;
        ajax.doPost("/php/login.php?c=l","mail="+name+"&pass="+pwd, function(url,txt) {
          lastStatus=txt;
          username=name;
          show();
          win.hide('login');
          if ((lastStatus === 'LOGGED_IN') || (lastStatus === 'ALREADY_LOGGED_IN') || (lastStatus === 'REGISTERED')) {
          }
        });
      }


      function logout() {
        ajax.doGet("/php/login.php?c=o", function(url,txt) {
          lastStatus=txt;
          username='';
          show();
        });
      }

      function getUser(callback) {
        ajax.doGet("/php/login.php?c=q", function(url,txt) {
var json=JSON.parse(txt);
          lastStatus=(json.status === '' ? "NOT_LOGGED" : "ALREADY_LOGGED_IN");
          username=json.name;
          show(callback);
        });
      }


      function getUserName() {
        return username;
      }





    function init(fn) {
        win.init();
        getUser(function() {
            if (fn !== undefined) fn();
          });
        
    } 

    return {
      init : init,
      getUserName : getUserName,
      getUser : getUser,
      login : login,
      show : show,
      logout : logout,
      onResize : onResize,
        register: register
    };

})();



