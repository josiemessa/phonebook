var should = require('should'); 
var assert = require('assert');
var request = require('supertest');

describe('Acceptance Criteria:', function(){
	var url = 'http://localhost:3000';
		it('should list all entries in the phone book', function(done) {
			request(url)
				.get('/')
				.expect(200)
				.end(function(err,res){
					if(err) {
						throw err;
					}
					res.status.should.equal(200);
					res.body.should.be.instanceof(Array).and.have.lengthOf(3);
          res.body.should.containDeep([{"Surname":"Messa", "Surname": "Lablaw", "Surname": "Bateman"}])
					done();
			})
		});
    it('should create a new entry to the phone book');
    it('should remove an existing entry in the phone book.');
    it('should update an existing entry in the phone book');
    it('should search for entries in the phone book by surname.');
})