var express    = require('express');
var bodyParser = require('body-parser');
var fs         = require('fs');

var phonebookFile = 'phonebook.json';
// Keep this synchronous as we'll be useless without the data loaded
var phonebook = JSON.parse(fs.readFileSync(phonebookFile, 'utf8'));
var app = express();
app.use(bodyParser.json());

app.get('/phonebook', function(req, res) {
	res.send(phonebook);
});

app.post('/phonebook', function(req, res){
  var allowedEntries = ["Surname", "Firstname", "Phone", "Address"];
  var allowedAddress = ["House", "Street", "Address Line 1", "Address Line 2", "City", "Postcode"];
  var newEntry = req.body;
  // Check for mandatory fields (all except address)
  if(!newEntry.hasOwnProperty("Surname") ||
     !newEntry.hasOwnProperty("Firstname") ||
     !newEntry.hasOwnProperty("Phone")) {
    res.status(400).send({"Error": "New entries must include the following mandatory fields: 'Surname', 'Firstname', 'Phone'"});
    return;
  }

  // Check any other fields supplied are in the accepted list
  for (var property in newEntry) {
    if (newEntry.hasOwnProperty(property)) {
      if (allowedEntries.indexOf(property) == -1) {
        res.status(400).send({"Error": "New entries can only include the following mandatory fields: 'Surname', 'Firstname', 'Phone', and optionally: 'Address'"});
        return;
      }
    }
  }

  // Error checking done, let's store some data!
  var keysAsInt = Object.keys(phonebook).map(function(key){
    return parseInt(key);
  }); // Convert keys to int
  var newKey = Math.max.apply(null, keysAsInt) + 1; // New key increments current highest key
  phonebook[newKey.toString()] = newEntry;

  fs.writeFile(phonebookFile, JSON.stringify(phonebook), function(err){
    if(err) {
      console.log(err);
      res.status(500).send({"Error": "Could not store new entry in phonebook"});
      return;
    }
    res.status(201).location("http://localhost:3000/phonebook/"+newKey.toString()).send();
    return;
  })


})



app.listen(3000);