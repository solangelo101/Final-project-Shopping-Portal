var http=new XMLHttpRequest();
var xhttp=new XMLHttpRequest();
var ahttp=new XMLHttpRequest();
var aAddProduct=document.getElementById("aAddProduct");
var divAddProduct=document.getElementById("divAddProduct");
var divListProducts=document.getElementById("divListProducts");

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



aAddProduct.addEventListener("click",function(event)
{
  //unhideAddNewProductLink(divAddProduct);
  addNewProduct();
});

function addNewProduct(){

  hideAddNewProductLink(aAddProduct);
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
  unhideAddNewProductLink(aAddProduct);
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
  //  divProductAdded.setAttribute("style","background-color:#ffe6e6;padding:20px;width:200px");

    var txtProductName=document.createElement("p");
    txtProductName.innerHTML=objectProduct.Name;

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
    }
}
http.send('number='+objectProduct._id);
  });
  unhideAddNewProductLink(aAddProduct);
  deleteProductForm();
}

function editProduct(product){

  hideAddNewProductLink(aAddProduct);
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
  inputProductName.innerHTML=product.Name;
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
  inputProductPrice.innerHTML=product.Price;
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
  inputProductQuantity.innerHTML=product.Quantity;
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
      window.location='/page11';   
    }
}
  });

btnCancel.addEventListener("click",function(event)
{
  deleteProductForm();
  unhideAddNewProductLink(aAddProduct);
});
}
