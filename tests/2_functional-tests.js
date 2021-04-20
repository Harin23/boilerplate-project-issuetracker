const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

var id;

suite('Functional Tests', function() {

  test("POST: with every field", function (done) {
      chai
        .request(server)
        .post('/api/issues/project')
        .send({
          "issue_title": "title",
          "issue_text": "issue",
          "created_by": "Joe",
          "assigned_to": "Joe",
          "status_text": "in progress"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "title");
          assert.equal(res.body.issue_text, "issue");
          assert.equal(res.body.created_by, "Joe");
          assert.equal(res.body.assigned_to, "Joe");
          assert.equal(res.body.status_text, "in progress");
          done();
        });
  });

  test("POST: with only required fields", function (done) {
      chai
        .request(server)
        .post('/api/issues/project')
        .send({
          "issue_title": "title",
          "issue_text": "issue",
          "created_by": "Joe"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "title");
          assert.equal(res.body.issue_text, "issue");
          assert.equal(res.body.created_by, "Joe");
          done();
        });
  });

  test("POST: without required fields", function (done) {
      chai
        .request(server)
        .post('/api/issues/project')
        .send({
          "issue_title": "title",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
  });

  test("GET: without filters", function (done) {
      chai
        .request(server)
        .get('/api/issues/project')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          id = res.body[0]._id;
          res.body.forEach(obj=>{
            assert.equal(obj.project, "project");
          })
          done();
        });
  });

  test("GET: with one filter", function (done) {
      chai
        .request(server)
        .get('/api/issues/project')
        .query({open: true})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          res.body.forEach(obj=>{
            assert.equal(obj.project, "project");
            assert.isTrue(obj.open);
          })
          done();
        });
  });

  test("GET: with multiple filters", function (done) {
      chai
        .request(server)
        .get('/api/issues/project')
        .query({open: true, created_by: "Joe"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          res.body.forEach(obj=>{
            assert.equal(obj.project, "project");
            assert.isTrue(obj.open);
            assert.equal(obj.created_by, "Joe");
          })
          done();
        });
  });

  test("PUT: update one", function (done) {
      chai
        .request(server)
        .put('/api/issues/project')
        .send({
          _id: id,
          issue_text: "updated"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          done();
        });
  });

  test("PUT: update one", function (done) {
      chai
        .request(server)
        .put('/api/issues/project')
        .send({
          _id: id,
          issue_text: "updated"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          done();
        });
  });

  test("PUT: update multiple", function (done) {
      chai
        .request(server)
        .put('/api/issues/project')
        .send({
          _id: id,
          issue_text: "updated",
          created_by: "A"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          done();
        });
  });

  test("PUT: update without id", function (done) {
      chai
        .request(server)
        .put('/api/issues/project')
        .send({
          issue_text: "updated"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
  });

  test("PUT: update with invalid id", function (done) {
      chai
        .request(server)
        .put('/api/issues/project')
        .send({
          _id: "gg",
          issue_text: "updated"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not update');
          done();
        });
  });

    test("Delete: with missing id", function (done) {
      chai
        .request(server)
        .delete('/api/issues/project')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
  });

  test("Delete: with invalid id", function (done) {
      chai
        .request(server)
        .delete('/api/issues/project')
        .send({
          _id: "gg",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not delete');
          done();
        });
  });

  test("Delete: with valid id", function (done) {
      chai
        .request(server)
        .delete('/api/issues/project')
        .send({
          _id: id,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully deleted');
          done();
        });
  });

});
