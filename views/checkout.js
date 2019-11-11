{var divProductsInCart=document.getElementById("divProductsInCart");
var activeuser=getActiveUser();
var totalPrice=0;
var xhttp=new XMLHttpRequest();
var ahttp=new XMLHttpRequest();
var http=new XMLHttpRequest();

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
  xhttp.open("GET",'/getcart?user='+activeuser);
  xhttp.send();
  xhttp.onreadystatechange=function()
{
    // readyState 4 means the request is done.
    // status 200 is a successful return.
    if (xhttp.readyState == 4 && xhttp.status == 200)
    {
      let cart = JSON.parse( xhttp.responseText) ;
      if(Array.isArray(cart)  && cart.length )
      {
        cart.forEach(function(cart1)
                      {
                        addToDOM(cart1);
                      });
                      var divBuyNow=document.getElementById("divBuyNow");
                      var txtTotalPrice=document.createElement("p");
                      txtTotalPrice.innerHTML=" To Pay : "+totalPrice;
                      divBuyNow.appendChild(txtTotalPrice);
                      addSpace(divBuyNow,1);
                      var btnBuy=document.createElement("button");
                      btnBuy.innerHTML="Buy Now";
                      divBuyNow.appendChild(btnBuy);

                      btnBuy.addEventListener("click",function(event)
                      {
                        checkForEachProduct(cart);
                        divProductsInCart.innerHTML="Your Order has been Placed!!";
                        txtTotalPrice.innerHTML="";
                        btnBuy.disabled=true;
                      });
                      var btnContinue=document.createElement("button");
                      btnContinue.innerHTML="Continue Shopping";
                      divBuyNow.appendChild(btnContinue);

                      btnContinue.addEventListener("click",function(event)
                      {
                        window.location="/listproducts";
                      });
      }
      else {
        var divBuyNow=document.getElementById("divBuyNow");
        var txtTotalPrice=document.createElement("p");
        txtTotalPrice.innerHTML=" To Pay : "+totalPrice;
        divBuyNow.appendChild(txtTotalPrice);
        addSpace(divBuyNow,1);
        var btnBuy=document.createElement("button");
        btnBuy.innerHTML="Buy Now";
        divBuyNow.appendChild(btnBuy);

        btnBuy.addEventListener("click",function(event)
        {
          checkForEachProduct(cart);
          divProductsInCart.innerHTML="Your Order has been Placed!!";
          txtTotalPrice.innerHTML="";
          btnBuy.disabled=true;
        });
        var emptyCarttxt=document.createElement("p");
        emptyCarttxt.innerHTML="Your cart is empty!";
        divProductsInCart.appendChild(emptyCarttxt);
        btnBuy.disabled=true;
        var btnContinue=document.createElement("button");
        btnContinue.innerHTML="Continue Shopping";
        divBuyNow.appendChild(btnContinue);

        btnContinue.addEventListener("click",function(event)
        {
          window.location="/listproducts";
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


function checkForEachProduct(cart)
{
  console.log(cart);
  cart.forEach(function(item)
  {
      console.log('Item being checked is\t',item);
        checkquantity(item);
        console.log('done with item\t',item.Name);
      });
}

function checkquantity(item)
{
  console.log('item being checkQuantitied is\t',item.Name);
  var xhr=new XMLHttpRequest();
  xhr.open("GET",'/checkquantity?id='+item.Id);
  xhr.send();
  xhr.onreadystatechange=function()
    {
      if(xhr.readyState==4 && xhr.status==200)
      {
        let product=JSON.parse(xhr.responseText);
        console.log('product quantity returned\t',product.Name);
        oldQuantity=product.Quantity;
        newQuantity=oldQuantity-item.Quantity;
        updateProductDatabase(item,newQuantity);
        console.log("imback! with item\t",item.Name);
        removeFromCart(item);
        console.log('Ive deleted!');
      }
      else {
        console.log(xhttp.status);
      }
    }
}

function updateProductDatabase(item,newQuantity)
{
  http.open("POST",'/updateProductDatabase',true);
  http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  http.onreadystatechange=function()
  {
    if(http.readyState==4 && http.status==200)
    {
    }
  }
  http.send('id='+item.Id+'&quantity='+newQuantity);
}

function removeFromCart(item)
{
  var rhttp=new XMLHttpRequest();
  rhttp.open("POST",'/removeFromCart',true);
  rhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  rhttp.onreadystatechange=function()
  {
    if(rhttp.readyState==4 && rhttp.status==200)
    {
      console.log('removed from cart!');
    }
    else {
      console.log('error',rhttp.status);
    }
  }
  rhttp.send('id='+item._id);
}


function addToDOM(objectProduct){
  var divProductAdded=document.createElement("div");
  var divProductsInCart=document.getElementById("divProductsInCart");
  divProductAdded.setAttribute("id",objectProduct.Id);
//  divProductAdded.setAttribute("style","background-color:#ffe6e6;padding:20px;width:200px");

  var txtProductName=document.createElement("p");
  txtProductName.innerHTML="Name : "+objectProduct.Name;

  var txtProductDesc=document.createElement("p");
  txtProductDesc.innerHTML="Price : "+objectProduct.Price;

  var inputProductQuantity=document.createElement("input");
  inputProductQuantity.setAttribute("type","number");
  inputProductQuantity.setAttribute("value",objectProduct.Quantity);
  

  var txtProductTotal=document.createElement("p");
  txtProductTotal.innerHTML="Total Price : "+(objectProduct.Price * objectProduct.Quantity);
  totalPrice=totalPrice+(objectProduct.Price*objectProduct.Quantity);

  var btnRemoveFromCart=document.createElement("button");
  btnRemoveFromCart.setAttribute("id",objectProduct._id);
  btnRemoveFromCart.innerHTML="Remove";
  btnRemoveFromCart.addEventListener("click",function(event)
  {
    removeFromCart(objectProduct);
    window.location="/checkout";
  });

  divProductAdded.appendChild(txtProductName);
  divProductAdded.appendChild(txtProductDesc);
  divProductAdded.appendChild(txtProductPrice);
  divProductAdded.appendChild(txtProductTotal);
  divProductsInCart.appendChild(divProductAdded);
  divProductsInCart.appendChild(btnRemoveFromCart);
  addSpace(divProductsInCart,2);

}

function addSpace(target,number){
  for(var i=0;i<number;i++)
  {
    var blankLine=document.createElement("br");
    target.appendChild(blankLine);
  }
}
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
