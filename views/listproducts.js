var products=getStoredProducts();
var cart=getCart();
var activeuser=getActiveUser();
var users=getUsers();
var xhttp=new XMLHttpRequest();

function getUsers()
{
  xhttp.open('GET','/users');
  xhttp.send();
  xhttp.onreadystatechange=function()
{
    // readyState 4 means the request is done.
    // status 200 is a successful return.
    if (xhttp.readyState == 4 && xhttp.status == 200)
    {
      //document.getElementById("users").innerHTML = xhttp.responseText; // 'This is the output.'
      let users = JSON.parse( xhttp.responseText) ;
      if(Array.isArray( users)  && users.length )
      {
      }
    }
    else
    {
        // An error occurred during the request.
       console.log(xhttp.status) ;
    }
  };
}

function getActiveUser()
{
  if(!localStorage.activeuser)
  {
    localStorage.activeuser=JSON.stringify("");
  }
    return JSON.parse(localStorage.activeuser);
}

function storeActiveUser(activeuser)
{
  localStorage.activeuser=JSON.stringify(activeuser);
}


function getCart()
{
  xhttp.open('GET','/cart');
  xhttp.send();
  xhttp.onreadystatechange=function()
{
    // readyState 4 means the request is done.
    // status 200 is a successful return.
    if (xhttp.readyState == 4 && xhttp.status == 200)
    {
      //document.getElementById("users").innerHTML = xhttp.responseText; // 'This is the output.'
      let cart = JSON.parse( xhttp.responseText) ;
      if(Array.isArray( cart)  && cart.length )
      {
      }
    }
    else
    {
        // An error occurred during the request.
       console.log(xhttp.status) ;
    }
  };
}
function getStoredProducts()
{
  xhttp.open('GET','/products');
  xhttp.send();
  xhttp.onreadystatechange=function()
{
    // readyState 4 means the request is done.
    // status 200 is a successful return.
    if (xhttp.readyState == 4 && xhttp.status == 200)
    {
      //document.getElementById("users").innerHTML = xhttp.responseText; // 'This is the output.'
      let products = JSON.parse( xhttp.responseText) ;
      if(Array.isArray( products)  && products.length )
      {
        products.forEach(function(product)
                      {
                        addToDOM(product);
                      });

      }
    }
    else
    {
        // An error occurred during the request.
       console.log(xhttp.status) ;
    }
  };
}


function addToDOM(objectProduct){
  var divProductAdded=document.createElement("div");
  divProductAdded.setAttribute("id","divProductAdded");
//  divProductAdded.setAttribute("style","background-color:#ffe6e6;padding:20px;width:200px");

  var txtProductName=document.createElement("p");
  txtProductName.innerHTML="Name : "+objectProduct.Name;

  var txtProductDesc=document.createElement("p");
  txtProductDesc.innerHTML="Description : "+objectProduct.Descp;

  var txtProductPrice=document.createElement("p");
  txtProductPrice.innerHTML="Price : "+objectProduct.Price;

  divProductAdded.appendChild(txtProductName);
  divProductAdded.appendChild(txtProductDesc);
  divProductAdded.appendChild(txtProductPrice);

  if(objectProduct.Quantity==0)
  {
    var txtOutofStock=document.createElement("p");
    txtOutofStock.innerHTML="Out Of Stock!";
    divProductAdded.appendChild(txtOutofStock);
  }
  else
  {
  var textQuantity=document.createElement("input");
  textQuantity.setAttribute("id",objectProduct.Id);
  textQuantity.setAttribute("type","number");
  textQuantity.setAttribute("placeholder","Enter quantity");
  textQuantity.setAttribute("style","width:150px;height:25px");
  divProductAdded.appendChild(textQuantity);

  var btnAddToCart=document.createElement("button");
  btnAddToCart.setAttribute("id","btnAddToCart");
  btnAddToCart.innerHTML="Add to Cart";
  btnAddToCart.setAttribute("style","width:150px;height:25px");
  divProductAdded.appendChild(btnAddToCart);
  btnAddToCart.addEventListener("click",function(event)
{
  if(checklogin())
  {
    if(checkQuantity(objectProduct.Id,textQuantity.value))
    {
      var indexNo=textQuantity.id;
      var index=getIndex(indexNo);
      var x=document.getElementById(objectProduct.Id).value;
      console.log(x);
      addToCartArray(products[index],objectProduct.Id,x);
    }
}
else {
  alert("KIndly login to save items to your cart!");
}
});
}
  divListProducts.appendChild(divProductAdded);
}


function checkQuantity(id,quan)
{
  var avaiableQuantity;
  for(var i=0;i<products.length;i++)
  {
    if(products[i].Id==id)
    {
      avaiableQuantity=parseInt(products[i].Quantity);
      break;
    }

  }
  if(avaiableQuantity<parseInt(quan))
  {
    alert("Not enough Stock available!");
    return false;
  }
  else
  {
    products[i].Quantity=products[i].Quantity-quan;
    storeProducts(products);
    return true;
  }
}


function checklogin()
{
  if(activeuser=="")
  return false;
  else {
    return true;
  }
}
function getIndex(id){
  for(var i=0;i<products.length;i++)
  {
    if(products[i].Id==id)
    return i;
  }
}

function addToCartArray(obj,indexNo,x)
{
  var cartObject=new Object();
  cartObject.User=activeuser;
  cartObject.Name=obj.Name;
  cartObject.Id=indexNo;
  cartObject.Quantity=parseInt(x);
  cartObject.Price=obj.Price;
  cart.push(cartObject);
  console.log(cart);
  storeCart(cart);
}

var userName="";
for(var i=0;i<users.length;i++)
{
  if(activeuser==users[i].Username)
  userName=users[i].Name;
}
var user=document.getElementById("puser");
if(userName=="")
{
  userName="Guest";
  user.innerHTML="Welcome, "+userName+"!<br>";
  var alogout=document.createElement("a");
  alogout.innerHTML="Login?";
  alogout.setAttribute("href","login.html");
  puser.appendChild(alogout);
}
else
{
user.innerHTML="Welcome, "+userName+"!<br>";
var alogout=document.createElement("a");
alogout.innerHTML="Logout?";
alogout.setAttribute("href","listproducts.html");
alogout.setAttribute("onclick","userLogout()");
puser.appendChild(alogout);
}

function userLogout()
{
  activeuser="";
  storeActiveUser(activeuser);
}
