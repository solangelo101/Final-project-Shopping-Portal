var usernametaken=document.getElementById("usernametaken");
var xhttp=new XMLHttpRequest();
var xhr = new XMLHttpRequest();
var activeuser=getActiveUser();

function storeActiveUser(activeuser)
{
  localStorage.activeuser=JSON.stringify(activeuser);
}

function getActiveUser()
{
  if(!localStorage.activeuser)
  {
    localStorage.activeuser=JSON.stringify("");
  }
    return JSON.parse(localStorage.activeuser);
}

function checkpassword()
{
  var password=document.getElementById("inputPassword").value;
  var repassword=document.getElementById("inputRePassword").value;
  if(password!=repassword)
  {
    document.getElementById("btnregister").disabled = true;
    document.getElementById("mismatcherror").innerHTML="Passwords do not match!";
  }
  else
  {
    document.getElementById("btnregister").disabled = false;
    document.getElementById("mismatcherror").innerHTML="";
  }
}

function checkUsername()
{
  var name=document.getElementById("inputName").value;
  var username=document.getElementById("inputUsername").value;
  var password=document.getElementById("inputPassword").value;

  xhttp.open("GET",'/checkUsername?username='+username);
  xhttp.send();
  xhttp.onreadystatechange=function()
{
    if (xhttp.readyState == 4 && xhttp.status == 200)
    {
      var checkedUsername=JSON.parse(xhttp.responseText);
      console.log('username stuff recieved is',checkedUsername);
      if(checkedUsername.Username==null)
      {
        registerform(name,username,password);
      }
      else {

      //  usernametaken.innerHTML="This username is already taken!!";
      alert("This username is already taken!!");
      }
    }
    else
    {
       console.log('error is',xhttp.status) ;
    }
  };
}
var alogin=document.createElement("a");
alogin.innerHTML="Or Login?";
alogin.setAttribute("href","/login");
var btnregister=document.getElementById("btnregister");
divregisterform.appendChild(alogin);

function registerform(name,username,password)
{
  activeuser
  xhr.open("POST",'/registerform',true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
  if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
    activeuser=username;
    storeActiveUser(activeuser);
    window.location='/listproducts';
  }
}
xhr.send('name='+name+'&username='+username+'&password='+password);
}


function userLogout()
{
  activeuser="";
  storeActiveUser(activeuser);
  location.reload();
}

var aAddProduct=document.getElementById("aAddProduct");
if(activeuser!="admin")
{
  aAddProduct.style.display="none";
}

var txtWelcome=document.getElementById("txtWelcome");
var aLogin=document.getElementById("aLogin");
var aLogout=document.getElementById("aLogout");
var aRegister=document.getElementById("aRegister");
if(activeuser=="")
{
  txtWelcome.innerHTML="Welcome, Guest!";
  aLogout.style.display="none";
}
else {
  txtWelcome.innerHTML="Welcome, "+activeuser+"!";
  aLogin.style.display="none";
  aRegister.style.display="none";
}
if(window.location.pathname=='/register')
{
  aRegister.style.display="none";
}
