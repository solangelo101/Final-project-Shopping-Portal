var cart=getCart();
var activeuser=getActiveUser();
var totalPrice=0;
var products=getStoredProducts();

function getStoredProducts()
{
  if(!localStorage.products)
  {
    localStorage.products=JSON.stringify([]);
  }
  return JSON.parse(localStorage.products);
}

function storeProducts(products){
  localStorage.products=JSON.stringify(products);
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

function storeCart(cart){
  localStorage.cart=JSON.stringify(cart);
}

function getCart()
{
  if(!localStorage.cart)
  {
    localStorage.cart=JSON.stringify([]);
  }
  return JSON.parse(localStorage.cart);
}


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
  removeFromCartArray();
  divProductsInCart.innerHTML="Your Order has been Placed!!";
  txtTotalPrice.innerHTML="";
  btnBuy.disabled=true;
});

var btnContinue=document.createElement("button");
btnContinue.innerHTML="Continue Shopping";
divBuyNow.appendChild(btnContinue);

btnContinue.addEventListener("click",function(event)
{
  window.location="listproducts.html";
});

var divProductsInCart=document.getElementById("divProductsInCart");
var flag=0;
for(var i=0;i<cart.length;i++)
{
  if(cart[i].User==activeuser)
  {
    addToDOM(cart[i]);
    flag=1;
  }
}
if(flag==0)
{
  var emptyCarttxt=document.createElement("p");
  emptyCarttxt.innerHTML="Your cart is empty!";
  divProductsInCart.appendChild(emptyCarttxt);
  btnBuy.disabled=true;
}


function removeFromCartArray()
{
  for(var i=0;i<cart.length;i++)
  {
    if(cart[i].User==activeuser)
    {
      cart.splice(i,1);
      storeCart(cart);
      i--;
    }
  }
}

//  var productIndex=getIndex(divProductAdded.id);

  //divProductAdded.parentNode.removeChild(divProductAdded);

function addToDOM(objectProduct){
  var divProductAdded=document.createElement("div");
  var divProductsInCart=document.getElementById("divProductsInCart");
  divProductAdded.setAttribute("id",objectProduct.Id);
//  divProductAdded.setAttribute("style","background-color:#ffe6e6;padding:20px;width:200px");

  var txtProductName=document.createElement("p");
  txtProductName.innerHTML="Name : "+objectProduct.Name;

  var txtProductDesc=document.createElement("p");
  txtProductDesc.innerHTML="Price : "+objectProduct.Price;

  var txtProductPrice=document.createElement("p");
  txtProductPrice.innerHTML="Quantity : "+objectProduct.Quantity;

  var txtProductTotal=document.createElement("p");
  txtProductTotal.innerHTML="Total Price : "+(objectProduct.Price * objectProduct.Quantity);
  totalPrice=totalPrice+(objectProduct.Price*objectProduct.Quantity);

  divProductAdded.appendChild(txtProductName);
  divProductAdded.appendChild(txtProductDesc);
  divProductAdded.appendChild(txtProductPrice);
  divProductAdded.appendChild(txtProductTotal);
  divProductsInCart.appendChild(divProductAdded);
  addSpace(divProductsInCart,2);
}

function addSpace(target,number){
  for(var i=0;i<number;i++)
  {
    var blankLine=document.createElement("br");
    target.appendChild(blankLine);
  }
}
