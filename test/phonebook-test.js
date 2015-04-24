var should = require('should'); 
var assert = require('assert');
var request = require('supertest');

describe('Acceptance Criteria:', function(){
	var url = 'http://localhost:3000';
		it('should list all entries in the phone book', function(done) {
			request(url)
				.get('/phonebook')
				.expect(200)
				.end(function(err,res){
					if(err) {
						throw err;
            done();
					}
					res.body.should.have.properties(["001", "002", "003"]);
          res.body["001"].should.have.properties({"Surname":"Messa"});
          res.body["002"].should.have.properties({"Surname":"Lablaw"});
          res.body["003"].should.have.properties({"Surname":"Bateman"});
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
          res.header.should.have.properties({"Location":"http://localhost:3000/phonebook/004"});
          done();

        })
    });

    it('should remove an existing entry in the phone book.');
    it('should update an existing entry in the phone book');
    it('should search for entries in the phone book by surname.');
})