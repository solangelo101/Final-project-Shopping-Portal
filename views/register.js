var xhttp=new XMLHttpRequest();
  var xhr = new XMLHttpRequest();
var users=getUsers();
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

function getUsers()
{
  xhttp.open("GET", "/users");
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

/*function storeUsers(users)
{
  xhr.open("POST", '/registerform', true);

  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        // Request finished. Do processing here.
    }.
    36+
  }
  xhr.send(users);
}*/

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

function register()
{
var name=document.getElementById("inputName").value;
var username=document.getElementById("inputUsername").value;
var password=document.getElementById("inputPassword").value;
var repassword=document.getElementById("inputRePassword").value;
if(username=="" || password=="" || name=="")
{
  return false;
}
else
{
  if(checkUsername(username))
  {
  createObject(username,password,name);
  }
}
activeuser=username;
console.log("in Javascript verification",activeuser);
storeActiveUser(activeuser);
//window.location='listproducts.html';
return true;
}

function createObject(u,p,n)
{
  var objUser=new Object();
  objUser.Name=n;
  objUser.Username=u;
  objUser.Password=p;
  users.push(objUser);
  storeUsers(objUsers);
}

function checkUsername(u)
{
  if(users==[])
  return true;
  else
  for(var i=0;i<users.length;i++)
  {
    if(users[i].Username==u)
    {
      alert("This username already exists!");
      return false;
    }
  }
  return true;
}
var alogin=document.createElement("a");
alogin.innerHTML="Or Login?";
alogin.setAttribute("href","login.html");
var formregister=document.getElementById("formregister");
formregister.appendChild(alogin);
