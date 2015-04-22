var express = require('express');
var fs      = require('fs');

// Keep this synchronous as we'll be useless without the data loaded
var phonebook = JSON.parse(fs.readFileSync('phonebook.json', 'utf8'));
var app = express();

app.get('/', function(req, res) {
  res.set('Content-Type', 'application/json');
	res.send(phonebook);
})

app.listen(3000);