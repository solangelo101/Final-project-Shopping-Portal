var rhttp=new XMLHttpRequest();
var xhttp=new XMLHttpRequest();
var ahttp=new XMLHttpRequest();
var http=new XMLHttpRequest();
var activeuser=getActiveUser();

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
  txtProductDesc.innerHTML="Description : "+objectProduct.Description;

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
  textQuantity.setAttribute("id",objectProduct._id);
  textQuantity.setAttribute("type","number");
  textQuantity.setAttribute("placeholder","Enter quantity");
  textQuantity.setAttribute("style","width:150px;height:25px");
  divProductAdded.appendChild(textQuantity);

  var btnAddToCart=document.createElement("button");
  btnAddToCart.setAttribute("id",objectProduct._id);
  btnAddToCart.innerHTML="Add to Cart";
  btnAddToCart.setAttribute("style","width:150px;height:25px");
  divProductAdded.appendChild(btnAddToCart);
  btnAddToCart.addEventListener("click",function(event)
{
  if(checkLogin())
  {
    ahttp.open('GET','/checkquantity?id='+btnAddToCart.id);
  ahttp.send();
    ahttp.onreadystatechange=function()
  {
      if (ahttp.readyState == 4 && ahttp.status == 200)
      {
        let available = JSON.parse( ahttp.responseText) ;
          console.log('available quantity\t',available.Quantity);
          if(available.Quantity>=parseInt(textQuantity.value))
          {
            addToCart(btnAddToCart.id,textQuantity.value,objectProduct.Name,objectProduct.Price);
          }
          else {
            alert("Not enough Stock!");
          }
      }
      else
      {
         console.log(ahttp.status) ;
      }
  };
}
  else {
    alert("Kindly login to save items to your cart!");
  }
});
}
  divListProducts.appendChild(divProductAdded);
}

function checkLogin()
{
  if(activeuser!=null)
  {
    return true;
  }
  else {
    false;
  }
}


function addToCart(productid,quantity,name,price)
{

    http.open("POST",'/addToCart',true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
    }
}
http.send('id='+productid+'&user='+activeuser+'&quantity='+quantity+'&name='+name+'&price='+price);
}

function addNewToCart(productid,quantity)
{

    http.open("POST",'/addNewToCart',true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
    }
}
http.send('id='+productid+'&user='+activeuser+'&quantity='+quantity);
}

var user=document.getElementById("puser");
if(activeuser=="")
{
  user.innerHTML="Welcome, Guest!<br>";
  var alogout=document.createElement("a");
  alogout.innerHTML="Login?";
  alogout.setAttribute("href","/login");
  puser.appendChild(alogout);
}
else
{
user.innerHTML="Welcome, "+activeuser+"!<br>";
var alogout=document.createElement("a");
alogout.innerHTML="Logout?";
alogout.setAttribute("href","/listproducts");
alogout.setAttribute("onclick","userLogout()");
puser.appendChild(alogout);
}

function userLogout()
{
  activeuser="";
  storeActiveUser(activeuser);
}
