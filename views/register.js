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
      if(checkedUsername.Username==null)
      {
        registerform(name,username,password);
      }
      else {
        alert("Username already taken!");
      }
    }
    else
    {
       console.log(xhttp.status) ;
    }
  };
}
var alogin=document.createElement("a");
alogin.innerHTML="Or Login?";
alogin.setAttribute("href","/login");
var formregister=document.getElementById("formregister");
formregister.appendChild(alogin);

function registerform(name,username,password)
{
  activeuser
  xhr.open("POST",'/registerform',true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
  if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
  }
}
xhr.send('name='+name+'&username='+username+'&password='+password);
}
