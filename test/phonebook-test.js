var should = require('should'); 
var assert = require('assert');
var request = require('supertest');

describe('Phonebook API', function(){
  // Base URL used throughout tests:
  var url = 'http://localhost:3000';

  describe('acceptance criteria:', function(){
      it('should list all entries in the phone book', function(done) {
        request(url)
          .get('/phonebook')
          .expect(200)
          .end(function(err,res){
            if(err) {
              throw err;
              done();
            }
            res.body.should.have.properties(["1", "2", "3"]);
            res.body["1"].should.have.properties({"Surname":"Messa"});
            res.body["2"].should.have.properties({"Surname":"Lablaw"});
            res.body["3"].should.have.properties({"Surname":"Bateman"});
            done();
              
        })
      });
      it('should create a new entry to the phone book', function(done){
        var body = {
          "Surname":"Person",
          "Firstname":"New",
          "Phone":"98765432",
          "Address":{
            "House": "The House",
            "Street": "The Street",
            "Postcode": "AB12 3CD"
          }
        }
        request(url)
          .post('/phonebook')
          .send(body)
          .expect(201)
          .end(function(err, res){
            if(err){
              throw err;
            }
            res.header.should.have.properties({"location":"http://localhost:3000/phonebook/4"});
            done();

          })
      });

      it('should remove an existing entry in the phone book.', function(done){
        request(url)
          .delete('/phonebook/4')
          .expect(204)
          .end(function(err){
            if(err){
              throw err;
            }
            request(url).get('/phonebook').end(function(err, res){
              if(err){
                throw err;
              }
              res.body.should.not.have.property('4');
              done();
            })
          })

      });
      it('should update an existing entry in the phone book', function(done){
        var body = {
          "Firstname":"Updated"
        }
        request(url)
          .put('/phonebook/3')
          .send(body)
          .expect(201)
          .end(function(err, res){
            if(err){
              throw err;
            }
            res.header.should.have.properties({"location":"http://localhost:3000/phonebook/3"});
            done();

          })
      });
      it('should search for entries in the phone book by surname.');
  });

  describe('error handling', function(){
    it('should reject new entries without mandatory fields', function(done){
      var body = {"Not": "good"};
      request(url)
        .post('/phonebook')
        .send(body)
        .expect(400)
        .end(function(err, res){
          if(err){
            throw err;
          }
          res.body.should.have.properties({"Error": "New entries must include the following mandatory fields: 'Surname', 'Firstname', 'Phone'"});
          done();
        })
    });

    it('should reject new entries with fields other than the four accepted fields', function(done){
      var body = {"Firstname": "Joe", "Surname": "Bloggs", "Phone": "01962123456", "Something":"Else"};
      request(url)
        .post('/phonebook')
        .send(body)
        .expect(400)
        .end(function(err, res){
          if(err){
            throw err;
          }
          res.body.should.have.properties({"Error": "New entries can only include the following mandatory fields: 'Surname', 'Firstname', 'Phone', and optionally: 'Address'"});
          done();
        })
    });

    it("should reject updates to phonebook entries that don't exist", function(done){
      var body = {"Firstname": "Joe"};
      request(url)
        .put('/phonebook/123')
        .send(body)
        .expect(400)
        .end(function(err, res){
          if(err){
            throw err;
          }
          res.body.should.have.properties({"Error": "No entry with id 123 exists in the phonebook"});
          done();
        })
    });

    it("should reject updates to phonebook entries containing invalid fields", function(done){
      var body = {"Something": "Else"};
      request(url)
        .put('/phonebook/3')
        .send(body)
        .expect(400)
        .end(function(err, res){
          if(err){
            throw err;
          }
          res.body.should.have.properties({"Error": "Phonebook entries can only include the following mandatory fields: 'Surname', 'Firstname', 'Phone', and optionally: 'Address'"});
          done();
        })

    })
  })
});
