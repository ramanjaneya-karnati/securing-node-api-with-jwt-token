// AuthController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var VerifyToken = require('./VerifyToken');

router.post('/register', function (req, res) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  }, function (err, user) {
    if(err) return res.status(500).send("There is a problem in registering the user.");

    //CREATE TOKEN
    const token = jwt.sign({id: user._id}, config.secret, {
      expiresIn: 86400 //expires in 24 hours
    });
    res.status(200).send({auth: true, token: token});
  });
});

//GET THE USER BY TOKEN
router.get('/me', VerifyToken, function (req, res, next) {
    User.findById(req.userId,{password:0}, function (err, user) {
      if (err) return res.status(500).send("There was a problem finding the user.");
      if (!user) return res.status(404).send("No user found.");
      res.status(200).send(user);
  });
});

// add the middleware function
router.use(function (user, req, res, next) {
  res.status(200).send(user);
});

//CHECK THE USER EXISTS
router.post('/login', function (req, res) {
  User.findOne({email: req.body.email}, function (err, user) {
    if(err) return res.status(500).send("Error on the server");
    if(!user) return res.send(404).send("User not found");
    console.log("body:"+req.body.password+"main:"+user.password);
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    console.log("passwordIsValid:" + passwordIsValid);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  })
})

//LOGGING OUT USER
router.get('/logout', function (req, res) {
  res.status(200).send({auth:false, token:null});
})

module.exports = router;