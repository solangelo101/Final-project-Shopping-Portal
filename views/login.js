var activeuser=getActiveUser();
var xhttp=new XMLHttpRequest();

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
function getActualPassword(username)
{
  xhttp.open("GET", "/actualpassword?username="+username+"");
  xhttp.send();
  if (xhttp.readyState == 4 && xhttp.status == 200)
  {
    return JSON.parse(xhttp.responseText);
  }
  else
  {
     console.log(xhttp.status) ;
  }
}

function validate()
{
  divgotoregister.innerHTML="";
  errormessage.innerHTML="";
var username=document.getElementById("inputUsername").value;
var password=document.getElementById("inputPassword").value;
checkpassword(username,password);

}
function checkpassword(username,password)
{
  var actualpass=getActualPassword(username);
  
  if(actualpass=="")
  {
    gotoregister();
  }
  else
  {
    if(actualpass==password)
    {
      activeuser=username;
      storeActiveUser(activeuser);
      document.getElementById("errormessage").innerHTML="";
      window.location="listproducts.html";
    }
    else {
      document.getElementById("errormessage").innerHTML="Password is incorrect!";
    }

  }
}

function gotoregister()
{
  var txtregister=document.createElement("p");
  txtregister.innerHTML="Looks like you are a new user!";
  var aregister=document.createElement("a");
  aregister.setAttribute("href","register.html");
  aregister.innerHTML="Register!?";
  divgotoregister.appendChild(txtregister);
  divgotoregister.appendChild(aregister);
}
