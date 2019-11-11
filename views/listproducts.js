var rhttp=new XMLHttpRequest();
var xhttp=new XMLHttpRequest();
var ahttp=new XMLHttpRequest();
var http=new XMLHttpRequest();
var activeuser=getActiveUser();
var start=0;
var limit=5;
var index=start+1;

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
  xhttp.open('GET','/products?since='+start+'&per_page='+limit);
  xhttp.send();
  xhttp.onreadystatechange=function()
{
    // readyState 4 means the request is done.
    // status 200 is a successful return.
    if (xhttp.readyState == 4 && xhttp.status == 200)
    {
      //document.getElementById("users").innerHTML = xhttp.responseText; // 'This is the output.'
      let products = JSON.parse(xhttp.responseText) ;
      if(Array.isArray(products)  && products.length )
      {
        products.forEach(function(product)
                      {
                        addToDOM(product);
                      });
                      getProductCount();
      }
    }
    else
    {
        // An error occurred during the request.
       console.log(xhttp.status) ;
    }
  };
}

var divnextprev=document.getElementById("divnextprev");
var divnextprev1=document.getElementById("divnextprev1");

function getProductCount()
{
  var rxhr=new XMLHttpRequest();
  rxhr.open("GET",'/getProductCount');
  rxhr.send();
  rxhr.onreadystatechange=function()
{
    // readyState 4 means the request is done.
    // status 200 is a successful return.
    if (rxhr.readyState == 4 && rxhr.status == 200)
    {
      //document.getElementById("users").innerHTML = xhttp.responseText; // 'This is the output.'
      var count1 = JSON.parse(rxhr.responseText);
      var count=count1.count2;
      createButtons(count);
      createButtons1(count);
    }
    else
    {
        // An error occurred during the request.
       console.log(rxhr.status) ;
    }
  };
}

function createButtons(count)
{

var next=document.createElement("button");
next.innerHTML="Next";
next.setAttribute("style","width:100px;height:25px");
next.addEventListener("click",function(event){
  nextFunction();
});
if(start+limit>=count)
{
  next.disabled=true;
}


var prev=document.createElement("button");
prev.innerHTML="Previous";
prev.setAttribute("style","width:100px;height:25px");
prev.addEventListener("click",function(event){
  prevFunction();
});
if(start-limit<0)
{
  prev.disabled=true;
}
divnextprev.appendChild(prev);
divnextprev.appendChild(next);
}

function createButtons1(count)
{

var next1=document.createElement("button");
next1.innerHTML="Next";
next1.setAttribute("style","width:100px;height:25px");
next1.addEventListener("click",function(event){
  nextFunction();
});
if(start+limit>=count)
{
  next1.disabled=true;
}


var prev1=document.createElement("button");
prev1.innerHTML="Previous";
prev1.setAttribute("style","width:100px;height:25px");
prev1.addEventListener("click",function(event){
  prevFunction();
});
if(start-limit<0)
{
  prev1.disabled=true;
}
divnextprev1.appendChild(prev1);
divnextprev1.appendChild(next1);
}


function nextFunction()
{
start+=5;
divListProducts.innerHTML="";
divnextprev.innerHTML="";
divnextprev1.innerHTML="";
index=start+1;

getStoredProducts();

}

function prevFunction()
{
divListProducts.innerHTML="";
divnextprev.innerHTML="";
divnextprev1.innerHTML="";
start-=5;
index=start+1;
getStoredProducts();

}

function addSpace(target,number){
  for(var i=0;i<number;i++)
  {
    var blankLine=document.createElement("br");
    target.appendChild(blankLine);
  }
}

function addToDOM(objectProduct){
  var divProductAdded=document.createElement("div");
  divProductAdded.setAttribute("id","divProductAdded");
//  divProductAdded.setAttribute("style","background-color:#ffe6e6;padding:20px;width:200px");

  var txtProductName=document.createElement("p");
  txtProductName.innerHTML=index+".<br><br>Name : "+objectProduct.Name;
  index++;

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
    if(textQuantity.value=="" || parseInt(textQuantity.value)<=0)
    {
      alert("Please enter a valid value!");
    }
    else {
    ahttp.open('GET','/checkquantity?id='+btnAddToCart.id);
    ahttp.send();
    ahttp.onreadystatechange=function()
  {
      if (ahttp.readyState == 4 && ahttp.status == 200)
      {
        let available = JSON.parse( ahttp.responseText) ;
          console.log('available quantity\t',available.Quantity," ",parseInt(textQuantity.value));
          if(available.Quantity>=parseInt(textQuantity.value))
          {
            checkPrevEntry(objectProduct._id,parseInt(textQuantity.value),available.Quantity,objectProduct.Name,objectProduct.Price);
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
}
else {
  alert("Kindly login to save items to your cart!");
}
});
}
  divListProducts.appendChild(divProductAdded);
}

function checkPrevEntry(productid,quantity,available,name,price)
{
  var chttp=new XMLHttpRequest();
  chttp.open("GET",'/checkPrevEntry?id='+productid+'&user='+activeuser);
  chttp.send();
  chttp.onreadystatechange=function()
  {
    if(chttp.readyState==4 & chttp.status==200)
    {
      let prevEntry=JSON.parse(chttp.responseText);
      console.log('Prev entry',prevEntry);
      if(prevEntry.Name!=null)
      {
        oldQuantity=prevEntry.Quantity;
        newQuantity=parseInt(oldQuantity)+parseInt(quantity);
        console.log('new quantity',typeof newQuantity,newQuantity)
        if(available>=newQuantity)
        {
        removeOldEntry(prevEntry);
        addToCart(productid,newQuantity,name,price);
      }
      else {
        alert("Not enough Stock!");
      }
      }
      else {
          addToCart(productid,quantity,name,price);
      }
    }
  }
}

function checkLogin()
{
  if(activeuser!="")
  {
    return true;
  }
  else {
    false;
  }
}

function removeOldEntry(prevEntry)
{
  var rxhr=new XMLHttpRequest();
  console.log("prevEntry",prevEntry);
  rxhr.open("POST",'/removeOldEntry',true);
  rxhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  rxhr.onreadystatechange=function()
  {
    if(rxhr.readyState==4 && rxhr.status==200){

    }
  }
  rxhr.send('id='+prevEntry._id);
}

function addToCart(productid,quantity,name,price)
{

    http.open("POST",'/addToCart',true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      alert("Added to Cart!");
    }
}
http.send('id='+productid+'&user='+activeuser+'&quantity='+quantity+'&name='+name+'&price='+price);
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
