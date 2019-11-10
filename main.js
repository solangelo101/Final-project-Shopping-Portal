//require statements
const express=require("express");
var mongoose=require("mongoose");
const path=require("path");
var bodyParser = require('body-parser');

//assign variables
const app=express();
const router = express.Router();
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/Script'));
app.use('/', router);
app.use(express.urlencoded({ extended: true }))
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// get requests to html pages
router.get('/checkout',function(req,res){
  res.sendFile(path.join(__dirname+'/views/checkout.html'));
});

router.get('/listproducts',function(req,res){
  res.sendFile(path.join(__dirname+'/views/listproducts.html'));
});

app.get('/login',function(req,res){
    res.render('login',{
    });
    console.log('user accessing login page');
});

router.get('/page11',function(req,res){
  res.sendFile(path.join(__dirname+'/views/page11.html'));
});

app.get('/register',function(req,res){
    res.render('register',{
        topicHead : 'Register',
    });
    console.log('user accessing register page');
});



// mongoose connection stuff
mongoose.connect("mongodb://localhost/shopping_portal",{ useNewUrlParser: true });
var db=mongoose.connection;
var Schema=mongoose.Schema;
mongoose.set('useFindAndModify', false);

//  array cart
var Cart=new Schema({
  User:String,
  Name:String,
  Id:Number,
  Quantity:Number,
  Price:Number,
})
var cart=mongoose.model("cart",Cart);
app.post('/addtocart',(req,res)=>
{
  console.log(req.body);
  var myData=new cart();
    myData.User=req.body.User;
    myData.Name=req.body.Name;
    myData.Id=req.body.Id;
    myData.Quantity=req.body.Qunatity;
    myData.Price=req.body.Price;

  myData.save(function(err)
{
  //body ..
})
    return res.redirect('listproducts');
})
app.get('/cart',(req,res)=>
{
  cart.find({},function(err,docs)
{
  res.send(docs);
})
})


// array users
var User=new Schema({
  Name:String,
  Username:String,
  Password:String,
//  Password1:String,
})
var users=mongoose.model("users",User);
app.post('/registerform',(req,res)=>
{
  console.log(req.body);
  var myData=new users();
  myData.Name=req.body.name;
  myData.Username=req.body.username;
  myData.Password=req.body.password;
  myData.save(function(err)
{
  //body ..
  if(!err)
  {
    console.log("Data Saved");
    console.log(myData);
    res.redirect('/listproducts')
  }
  else {
    console.log(err)
  }
})
})
app.get('/actualpassword',(req,res)=>
{
  usernameSent=req.query.username;
  console.log("Username ",usernameSent);
  users.findOne({Username:usernameSent},function(err,docs)
{
  console.log("Actual Password ",docs.Password);
  res.send(docs.Password);
})

})

app.get('/users',(req,res)=>
{
  users.find({},function(err,docs)
{
  res.send(docs);
})
})

// array products
var Products=new Schema({
  Name:String,
  Description:String,
  Price:Number,
  Quantity:Number,
})
var products=mongoose.model("products",Products);
var productNumber=1;
app.get('/main',(req,res)=>
{
  products.find().sort({_id:-1}).limit(1).exec(function(err, docs) {
  productNumber=docs._id
  console.log(productNumber);
  console.log('latest entry   ',docs);
  res.redirect('/page11');
});
});

app.post('/addProduct',(req,res)=>
{
  /*products.find().sort({Number:-1}).limit(1).exec(function(err, docs) {
    var productNumber=docs._id;
    console.log('latest entry   ',docs);
  });*/
  console.log(req.body);
  console.log('product number ',productNumber);
  var myData=new products();
    myData.Name=req.body.Name;
    myData.Description=req.body.Descp;
    myData.Price=req.body.Price;
    myData.Quantity=req.body.Quantity;
  myData.save(function(err)
{
  //body ..---
  console.log(myData);
  res.redirect('/page11');
})
})
app.get('/products',(req,res)=>
{
  products.find({},function(err,docs)
{
//  console.log('database products are',docs);
  res.send(docs);
});
})

app.get('/getToBeEditedProduct',(req,res)=>
{
  products.findOne({_id:req.query.number},function(err,docs)
{
  if(!err)
  {
    res.send(docs);
  }
});
})

app.post('/editProduct',(req,res)=>
{
  console.log('req sent is\n',req.body);
  filter={_id:req.body.number};
  update={Name:req.body.name,Description:req.body.descp,Price:req.body.price,Quantity:req.body.quantity};
  products.findOneAndUpdate(filter,update,function(err,docs)
{
  if(!err)
  {
    console.log("Hooray!");
    //res.redirect('/page11');
  }
});

})

app.post('/deleteProduct',(req,res)=>{
  console.log('delete product body is\t',req.body);
  filter={_id:req.body.number};
  products.findOneAndDelete(filter,function(err,docs)
{
  res.redirect('/page11');
});
})

app.listen(5555);
