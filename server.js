// server.js
var app = require('./app');
var port = process.env.PORT || 2020;
var server = app.listen(port, function() {
  console.log('Server started on port ' + port);
});