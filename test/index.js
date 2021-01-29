const app = require("./../app");
const chai = require("chai")
const chaiHttp = require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

describe("site", function() {
    // Describe what to test
    it("Should have home page", function(done) {
	//Describe what should happen
	chai
	    .request(app)
	    .get('/')
	    .end(function(err, res) {
		if (err) {
		    return done(err);
		}
		res.status.should.be.equal(200);
		return done(); //Call done if the test completed successfully
	    });
    });
});
