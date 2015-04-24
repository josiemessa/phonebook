var express = require('express');
var bodyParser = require('body-parser');
var fs      = require('fs');

// Keep this synchronous as we'll be useless without the data loaded
var phonebook = JSON.parse(fs.readFileSync('phonebook.json', 'utf8'));
var app = express();
app.use(bodyParser.json());

app.get('/phonebook', function(req, res) {
  res.set('Content-Type', 'application/json');
	res.send(phonebook);
});

app.post('/phonebook', function(req, res){
  res.send();
})



app.listen(3000);