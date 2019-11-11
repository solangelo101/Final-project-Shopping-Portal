var http=new XMLHttpRequest();
var xhttp=new XMLHttpRequest();
var ahttp=new XMLHttpRequest();
var aAddNewProduct=document.getElementById("aAddNewProduct");
var divAddProduct=document.getElementById("divAddProduct");
var divListProducts=document.getElementById("divListProducts");
var activeuser=getActiveUser();
var start=0;
var limit=5;
var index=start+1;

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

aAddNewProduct.addEventListener("click",function(event)
{  //unhideAddNewProductLink(divAddProduct);
  addNewProduct();
});

function addNewProduct(){

  hideAddNewProductLink(aAddNewProduct);
  var formAddProduct=document.createElement("form");
  formAddProduct.setAttribute("name","formEditProduct");
//  formAddProduct.setAttribute("onsubmit","addToObject()");
  formAddProduct.setAttribute("action","/addProduct");
  formAddProduct.setAttribute("method","POST");

  var labelAddProduct=document.createElement("label");
  labelAddProduct.innerHTML="Enter element details";
  formAddProduct.appendChild(labelAddProduct);

  addSpace(formAddProduct,2);

  var inputProductName=document.createElement("input");
  inputProductName.setAttribute("name","Name");
  inputProductName.setAttribute("type","text");
  inputProductName.setAttribute("placeholder","Enter product name");
  inputProductName.setAttribute("style","wnameth:40%");
  formAddProduct.appendChild(inputProductName);

  addSpace(formAddProduct,2);

  var labelProductDescp=document.createElement("label");
  labelProductDescp.innerHTML="Product Description";
  formAddProduct.appendChild(labelProductDescp);

  addSpace(formAddProduct,2);

  var inputProductDescp=document.createElement("textarea");
  inputProductDescp.setAttribute("name","Descp");
  inputProductDescp.setAttribute("type","text");
  inputProductDescp.setAttribute("placeholder","Enter product description");
  inputProductDescp.setAttribute("style","width:40%");
  formAddProduct.appendChild(inputProductDescp);

  addSpace(formAddProduct,2);

  var labelProductPrice=document.createElement("label");
  labelProductPrice.innerHTML="Product price";
  formAddProduct.appendChild(labelProductPrice);

  addSpace(formAddProduct,2);

  var inputProductPrice=document.createElement("input");
  inputProductPrice.setAttribute("name","Price");
  inputProductPrice.setAttribute("type","number");
  inputProductPrice.setAttribute("placeholder","Enter product price");
  inputProductPrice.setAttribute("style","width:40%");
  formAddProduct.appendChild(inputProductPrice);

  addSpace(formAddProduct,2);

  var labelProductQuantity=document.createElement("label");
  labelProductQuantity.innerHTML="Enter quantity";
  formAddProduct.appendChild(labelProductQuantity);

  addSpace(formAddProduct,2);

  var inputProductQuantity=document.createElement("input");
  inputProductQuantity.setAttribute("name","Quantity");
  inputProductQuantity.setAttribute("type","number");
  inputProductQuantity.setAttribute("style","width:40%");
  inputProductQuantity.setAttribute("placeholder","Enter product Quantity");
  formAddProduct.appendChild(inputProductQuantity);

  addSpace(formAddProduct,2);

  var btnSubmit=document.createElement("input");
  btnSubmit.setAttribute("type","submit");
  btnSubmit.setAttribute("name","btnSubmit");
  btnSubmit.setAttribute("style","width:20%;height:25px");
  btnSubmit.innerHTML="Submit";
  formAddProduct.appendChild(btnSubmit);

//  addSpace(divAddProduct,2);

  var btnCancel=document.createElement("button");
  btnCancel.setAttribute("name","btnCancel");
  btnCancel.setAttribute("style","width:20%;height:25px");
  btnCancel.innerHTML="Cancel";
  formAddProduct.appendChild(btnCancel);
  divAddProduct.appendChild(formAddProduct);

btnCancel.addEventListener("click",function(event)
{
  deleteProductForm();
  unhideAddNewProductLink(aAddNewProduct);
});
}

function deleteProductForm(){
  var childNodes = divAddProduct.childNodes;
  for (var i = 0; childNodes.length > 0;)
  {
    divAddProduct.removeChild(childNodes[i]);
  }
}

function unhideAddNewProductLink(target)
{
  target.setAttribute("style","visibility:visible");
}

function addSpace(target,number){
  for(var i=0;i<number;i++)
  {
    var blankLine=document.createElement("br");
    target.appendChild(blankLine);
  }
}

function hideAddNewProductLink(target)
{
  target.setAttribute("style","visibility:hidden");
}

function addToDOM(objectProduct){
  var divProductAdded=document.createElement("div");
    divProductAdded.setAttribute("id",objectProduct._id);
  //  divProductAdded.setAttribute("style","background-color:#ffe6e6;padding:20px;width:100px");
    var txtProductName=document.createElement("p");
    txtProductName.innerHTML=index+".<br><br>"+objectProduct.Name;
    index++;

    var txtProductDesc=document.createElement("p");
    txtProductDesc.innerHTML=objectProduct.Description;

    var txtProductPrice=document.createElement("p");
    txtProductPrice.innerHTML=objectProduct.Price;

    var txtProductQuantity=document.createElement("p");
    txtProductQuantity.innerHTML=objectProduct.Quantity;

    var btnEdit=document.createElement("button");
    btnEdit.setAttribute("id",objectProduct._id);
    btnEdit.innerHTML="Edit";
    btnEdit.setAttribute("style","width:70px;height:25px");

    var btnDelete=document.createElement("button");
    btnDelete.setAttribute("id","btnDelete");
    btnDelete.innerHTML="Delete";
    btnDelete.setAttribute("style","width:70px;height:25px");

    divProductAdded.appendChild(txtProductName);
    divProductAdded.appendChild(txtProductDesc);
    divProductAdded.appendChild(txtProductPrice);
    divProductAdded.appendChild(txtProductQuantity);
    divProductAdded.appendChild(btnEdit);
    divProductAdded.appendChild(btnDelete);
    divListProducts.appendChild(divProductAdded);


  btnEdit.addEventListener("click",function(event)
  {
    xhttp.open('GET','/getToBeEditedProduct?number='+btnEdit.id);
  xhttp.send();
    xhttp.onreadystatechange=function()
  {
      // readyState 4 means the request is done.
      // status 200 is a successful return.
      if (xhttp.readyState == 4 && xhttp.status == 200)
      {
        let product = JSON.parse( xhttp.responseText) ;
          console.log(product);
          editProduct(product);
      }
      else
      {
          // An error occurred during the request.
         console.log(xhttp.status) ;
      }
    };
  });
  btnDelete.addEventListener("click",function(event)
  {
    http.open("POST",'/deleteProduct',true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      location.reload();
    }
}
http.send('number='+objectProduct._id);
  });
  unhideAddNewProductLink(aAddNewProduct);
  deleteProductForm();
}

function editProduct(product){

  hideAddNewProductLink(aAddNewProduct);
  var formEditProduct=document.createElement("div");
/*  formEditProduct.setAttribute("name","formEditProduct");
//  formEditProduct.setAttribute("onsubmit","addToObject()");
  formEditProduct.setAttribute("action","/editProduct");
  formEditProduct.setAttribute("method","POST");*/

  var labelAddProduct=document.createElement("label");
  labelAddProduct.innerHTML="Enter element details";
  formEditProduct.appendChild(labelAddProduct);

  addSpace(formEditProduct,2);

  var inputProductName=document.createElement("input");
  inputProductName.setAttribute("name","Name");
  inputProductName.setAttribute("type","text");
  inputProductName.setAttribute("value",product.Name);
  inputProductName.setAttribute("placeholder","Enter product name");
  inputProductName.setAttribute("style","wnameth:40%");
  formEditProduct.appendChild(inputProductName);

  addSpace(formEditProduct,2);

  var labelProductDescp=document.createElement("label");
  labelProductDescp.innerHTML="Product Description";
  formEditProduct.appendChild(labelProductDescp);

  addSpace(formEditProduct,2);

  var inputProductDescp=document.createElement("textarea");
  inputProductDescp.setAttribute("name","Descp");
  inputProductDescp.setAttribute("type","text");
  inputProductDescp.innerHTML=product.Description;
  inputProductDescp.setAttribute("placeholder","Enter product description");
  inputProductDescp.setAttribute("style","width:40%");
  formEditProduct.appendChild(inputProductDescp);

  addSpace(formEditProduct,2);

  var labelProductPrice=document.createElement("label");
  labelProductPrice.innerHTML="Product price";
  formEditProduct.appendChild(labelProductPrice);

  addSpace(formEditProduct,2);

  var inputProductPrice=document.createElement("input");
  inputProductPrice.setAttribute("name","Price");
  inputProductPrice.setAttribute("type","text");
  inputProductPrice.setAttribute("value",product.Price);
  inputProductPrice.setAttribute("placeholder","Enter product price");
  inputProductPrice.setAttribute("style","width:40%");
  formEditProduct.appendChild(inputProductPrice);

  addSpace(formEditProduct,2);

  var labelProductQuantity=document.createElement("label");
  labelProductQuantity.innerHTML="Enter quantity";
  formEditProduct.appendChild(labelProductQuantity);

  addSpace(formEditProduct,2);

  var inputProductQuantity=document.createElement("input");
  inputProductQuantity.setAttribute("name","Quantity");
  inputProductQuantity.setAttribute("type","text");
  inputProductQuantity.setAttribute("value",product.Quantity);
  inputProductQuantity.setAttribute("style","width:40%");
  inputProductQuantity.setAttribute("placeholder","Enter product Quantity");
  formEditProduct.appendChild(inputProductQuantity);

  addSpace(formEditProduct,2);

  var btnEdit=document.createElement("button");
  //btnSubmit.setAttribute("type","submit");
  btnEdit.setAttribute("id:",product._id);
  btnEdit.setAttribute("name","btnEdit");
  btnEdit.setAttribute("style","width:20%;height:25px");
  btnEdit.innerHTML="Submit";
  formEditProduct.appendChild(btnEdit);

//  addSpace(divAddProduct,2);

  var btnCancel=document.createElement("button");
  btnCancel.setAttribute("name","btnCancel");
  btnCancel.setAttribute("style","width:20%;height:25px");
  btnCancel.innerHTML="Cancel";
  formEditProduct.appendChild(btnCancel);
  divAddProduct.appendChild(formEditProduct);

  btnEdit.addEventListener("click",function(event)
  {
    var num=product._id;
    var name=inputProductName.value;
    var descp=inputProductDescp.value;
    var price=inputProductPrice.value;
    var quan=inputProductQuantity.value;
    ahttp.open("POST",'/editProduct',true);
    ahttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ahttp.send('number='+num+'&name='+name+'&descp='+descp+'&price='+price+'&quantity='+quan);
    ahttp.onreadystatechange = function() {
  if (ahttp.readyState == 4 && ahttp.status == 200) {
      //console.log(ahttp.responseText);

    }
}
location.reload(true) ;
  });

btnCancel.addEventListener("click",function(event)
{
  deleteProductForm();
  unhideAddNewProductLink(aAddNewProduct);
});
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
  aAddProduct.style.visibility="hidden";
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
