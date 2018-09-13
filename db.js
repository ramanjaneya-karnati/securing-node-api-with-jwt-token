// db.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://<username>:<password>@<databasename>', { useNewUrlParser: true });