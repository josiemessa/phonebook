var express    = require('express');
var bodyParser = require('body-parser');
var fs         = require('fs');

var phonebookFile = 'phonebook.json';
var allowedEntries = ["Surname", "Firstname", "Phone", "Address"];

// Keep this synchronous as we'll be useless without the data loaded
console.log("Reading in phonebook");
var phonebook = JSON.parse(fs.readFileSync(phonebookFile, 'utf8'));
var app = express();
app.use(bodyParser.json());

app.get('/phonebook', function(req, res) {
  // only go down this path if the "surname" query parameter was used
  if(req.query && (null != req.query.surname)) {
    // Look through phonebook for matching surnames
    var responseBody = {};
    for (var entry in phonebook) {
      if(phonebook.hasOwnProperty(entry)) {
        if(phonebook[entry].Surname == req.query.surname) {
          responseBody[entry] = phonebook[entry]; // add entry to response
        }
      }
    }
    res.send(responseBody);
    return;
  } else {
    // If no query parameters were used then send the entire phonebook back
    res.send(phonebook);
    return;
  }
});

app.post('/phonebook', function(req, res){
  var newEntry = req.body;
  // Check for mandatory fields (all except address)
  if(!newEntry.hasOwnProperty("Surname") ||
     !newEntry.hasOwnProperty("Firstname") ||
     !newEntry.hasOwnProperty("Phone")) {
    res.status(400).send({"Error": "New entries must include the following mandatory fields: 'Surname', 'Firstname', 'Phone'"});
    return;
  }

  // Check no other fields were supplied other than those that can be stored in phonebook
  for (var property in newEntry) {
    if (newEntry.hasOwnProperty(property)) {
      if (allowedEntries.indexOf(property) == -1) {
        res.status(400).send({"Error": "New entries can only include the following mandatory fields: 'Surname', 'Firstname', 'Phone', and optionally: 'Address'"});
        return;
      }
    }
  }

  // Error checking done, let's store some data!
  var keysAsInt = Object.keys(phonebook).map(function(key){ // Convert phonebook entry keys to int
    return parseInt(key);
  }); 
  var newKey = Math.max.apply(null, keysAsInt) + 1; // Create new key to store new phonebook entry
  phonebook[newKey.toString()] = newEntry; 

  // Store new entry
  console.log("Storing new entry in phonebook...");
  fs.writeFile(phonebookFile, JSON.stringify(phonebook, null, 2), function(err){
    if(err) {
      console.log("**ERROR** "+err);
      res.status(500).send({"Error": "Could not store new entry in phonebook"});
      return;
    }
    console.log("...New entry stored with key "+newKey);
    res.status(201).location("http://localhost:3000/phonebook/"+newKey.toString()).send();
    return;
  })

});


app.get('/phonebook/:id', function(req, res){
  var id = req.params.id;

  // Check if ID matches one already stored in the phonebook
  if (!phonebook.hasOwnProperty(id)){
    res.status(400).send({"Error": "No entry with id "+id+" exists in the phonebook"});
    return;
  }

  res.send(phonebook[id]);
  return;
});

app.put('/phonebook/:id', function(req, res){
  var id = req.params.id;

  // Check if ID matches one already stored in the phonebook
  if (!phonebook.hasOwnProperty(id)){
    res.status(400).send({"Error": "No entry with id "+id+" exists in the phonebook"});
    return;
  }
  var newEntry = req.body;

  for(var property in newEntry){
    if(newEntry.hasOwnProperty(property)){
      // Check supplied fields are valid for a phonebook entry
      if(allowedEntries.indexOf(property) == -1) {
        res.status(400).send({"Error": "Phonebook entries can only include the following mandatory fields: 'Surname', 'Firstname', 'Phone', and optionally: 'Address'"});
        return;
      }
      // All good! Update the supplied property
      phonebook[id][property] = newEntry[property];
      console.log("Updating phonebook entry "+id+"...");
      fs.writeFile(phonebookFile, JSON.stringify(phonebook, null, 2), function(err){
      if(err) {
        console.log("**ERROR** "+err);
        res.status(500).send({"Error": "Could not update entry in phonebook"});
        return;
      }
      console.log("...Phonebook entry updated with id "+id);
      res.status(201).location("http://localhost:3000/phonebook/"+id).send();
      return;
    })
    }
  }
})

app.delete('/phonebook/:id', function(req, res){
  var id = req.params.id;

  // Check if ID matches one already stored in the phonebook
  if (!phonebook.hasOwnProperty(id)){
    res.status(400).send({"Error": "No entry with id "+id+" exists in the phonebook"});
    return;
  }

  // Get deleting
  delete phonebook[id];
  // Update phonebook file
  console.log("Deleting phonebook entry "+id+"...");
  fs.writeFile(phonebookFile, JSON.stringify(phonebook, null, 2), function(err){
      if(err) {
        console.log("**ERROR** "+err);
        res.status(500).send({"Error": "Could not delete entry in phonebook"});
        return;
      }
  });
  console.log("...Phonebook entry deleted with id "+id);
  res.sendStatus(204);
});

console.log("Starting Express server on port 3000");
app.listen(3000);