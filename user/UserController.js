// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');

// CREATES A NEW USER
router.post('/', function (req, res) {
  User.create({
      name : req.body.name,
      email : req.body.email,
      password : req.body.password
    },
    function (err, user) {
      if (err) return res.status(500).send("There was a problem adding the information to the database.");
      res.status(200).send(user);
    });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  User.find({}, function (err, users) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(users);
  });
});

//RETURNS SINGLE USER BY ID
router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) return res.status(500).send("There is a problem in finding the user");
    if(!user) return res.status(404).send("User not found");
    res.status(200).send(user);
  });
});


//DELETING A USER BY ID
router.delete('/:id', function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if(err) return res.status(500).send("There is a problem in deleting the user");
    res.status(200).send("Deleted the user"+ user.name + user);
  });
});


//UPDATING A SINGLE USER BY ID
router.put('/:id', function (req, res) {
  User.findOneAndUpdate(req.params.id,req.body, {new: true},  function (err, user) {
    if(err) return res.status(500).send("There is a problem in updating the user");
    res.status(200).send("Updated the user" + user);
  })
})
module.exports = router;