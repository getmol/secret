//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
 
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
 const userSchema = new mongoose.Schema ({
     email:String,
     password: String
 });
 const secret="thisisourlitesecrets.";
 userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });
 
 const User = new mongoose.model("User", userSchema);

app.use (express.static("public"));
app.set('views engine', 'ejs');
app.use(bodyParser.urlencoded(
    {extended:true}));

app.get("/", function(req, res){
    res.render("home.ejs");
});


app.get("/login", function(req, res){
    res.render("login.ejs");
});


app.get("/register", function(req, res){
    res.render("register.ejs");
});

app.post("/register", function(req,res){
    const newUser = new User({
       email: req.body.username,
       password: req.body.password
    });
    newUser.save(function(err){
        if(err){
           console.log(err);
        }else{
            res.render("secrets.ejs");
        }
    });
});


app.post("/login", function(req,res){
    const username =req.body.username;
    const password = req.body.password;
 User.findOne({email:username}, function (err, foundUser){
    if (err){
        console.log(err);
 } else{
     if (foundUser){
         if(foundUser.password ===password){
            res.render("secrets.ejs");
         }
     }
 }
});
        
});
    app.listen(3000,function(){
        console.log("server started on port 3000");
    });