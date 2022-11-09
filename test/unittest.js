//https://codehandbook.org/unit-test-express-route/
const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('../app')


describe('Unit testing the / route', function() {
	it('index should contain Welcome', function() {
      return request(app)
        .get('/')
        .then(function(response){
            expect(response.text).to.contain('Welcome');
        })
    });

});

describe('Unit testing the /form route', function() {

    it('/form should return OK status', function() {
      return request(app)
        .get('/form')
        .then(function(response){
            assert.equal(response.status, 200)
        })
    });

    it('/form should contain lastName', function() {
      return request(app)
        .get('/form')
        .then(function(response){
            expect(response.text).to.contain('lastName');
        })
    });
	
	
	    it('/form33 should return 404 status', function() {
      return request(app)
        .get('/form33')
        .then(function(response){
            assert.equal(response.status, 404)
        })
    });
	
	it("/form33 should not return 200 status", function()  {
     return request(app)
        .get('/form33')
        .then(function(response){
            assert.notEqual(response.status, 200)
		})
	});

});