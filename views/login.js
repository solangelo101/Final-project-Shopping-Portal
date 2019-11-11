var activeuser=getActiveUser();
var xhttp=new XMLHttpRequest();
var newuser=document.getElementById("newuser");

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

function getActualPassword(username,password)
{
  xhttp.open("GET", "/actualpassword?username="+username);
  xhttp.send();

    xhttp.onreadystatechange=function()
    {
  if (xhttp.readyState == 4 && xhttp.status == 200)
  {
    actualpassword=JSON.parse(xhttp.responseText);
    console.log('actual password is\t',actualpassword);
    checkpassword(password,actualpassword.Password,username);
  }
  else
  {
     console.log(xhttp.status) ;
  }
}
}

function validate()
{
errormessage.innerHTML="";
var username=document.getElementById("inputUsername").value;
var password=document.getElementById("inputPassword").value;
getActualPassword(username,password);

}

function checkpassword(password,actualpass,username)
{
  console.log('the actual password is\t',actualpass);
  if(actualpass=="")
  {
    gotoregister();
  }
  else
  {
    newuser.innerHTML="";
    if(actualpass==password)
    {
      activeuser=username;
      storeActiveUser(activeuser);
      document.getElementById("errormessage").innerHTML="";
      window.location="/listproducts";
    }
    else {
      document.getElementById("errormessage").innerHTML="Password is incorrect!";
    }

  }
}

function gotoregister()
{
  //divgotoregister.innerHTML="";
  var txtregister=document.createElement("p");
  txtregister.innerHTML="Looks like you are a new user!";
/*  var aregister=document.createElement("a");
  aregister.setAttribute("href","/register");
  aregister.innerHTML="Register!?";*/
  newuser.appendChild(txtregister);
  //newuser.appendChild(aregister);
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
if(window.location.pathname=='/login')
{
  aLogin.style.display="none";
}
