require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

//Log API_KEY
console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
//connect to MongoDB by specifying port to access MongoDB server
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB');
};

//Create User SCHEMA
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//Create a secret String
//const secret = "Thisourlittlesecret."
//userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});


//Create User MODEL
const User = new mongoose.model("User", userSchema);





//Create home route or root route
app.get("/", function(req,res){
  res.render("home");
});

//Create login route
app.get("/login", function(req, res){
  res.render("login");
});

//Create registration route
app.get("/register", function(req, res){
  res.render("register");
});

//Create register route
app.post("/register", function(req, res){
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if (err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

//Create login route
app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

User.findOne({email: username}, function(err, foundUser){
  if (err){
    console.log(err);
  } else {
    if (foundUser){
      if (foundUser.password === password){
        res.render("secrets");
      }
    }
  }
});

});












app.listen(3000, function() {
  console.log("Server started on port 3000");
});
