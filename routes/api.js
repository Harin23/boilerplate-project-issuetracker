'use strict';
const mongoose = require('mongoose');
const URI = process.env.DB;

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const issueSchema = new mongoose.Schema({
  project: {type: String, required: true},
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  assigned_to: {type: String, default: ""},
  status_text: {type: String, default: ""},
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  open: { type: Boolean, default: true }
});

const ISSUE = mongoose.model("issues", issueSchema);

module.exports = function (app) {


  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      ISSUE.find({...req.query, project: project}, (err, data)=>{
        if(err){
          // console.log(err);
        }else{
          res.json(data);
        }
      })
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let issueDoc = new ISSUE({
        project: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        open: req.body.open
      });
      issueDoc.save((err, doc)=>{
        if(err){
          // console.log(err);
          res.json({ error: 'required field(s) missing' })
        }else{
          res.json(doc);
        }
      })
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let body = req.body;
      if(!body._id){
        res.json({ error: 'missing _id' })
      }else if(Object.keys(body).filter(key=>body[key]!="").length < 2){
        res.json({ error: 'no update field(s) sent', '_id': body._id })
      }else{
        let updates = {
          ...(body.issue_title) && {issue_title: body.issue_title},
          ...(body.issue_text) && {issue_text: body.issue_text},
          ...(body.created_by) && {created_by: body.created_by},
          ...(body.assigned_to) && {assigned_to: body.assigned_to},
          ...(body.status_text) && {status_text: body.status_text},
          updated_on: Date.now()
        }
        ISSUE.findByIdAndUpdate(body._id, updates, {overwrite: false}, (err, doc)=>{
          if(err || doc == null){
            res.json({ error: 'could not update', '_id': body._id })
          }else{
            res.json({ result: 'successfully updated', '_id': body._id });
          }      
        })
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      if(!req.body._id){
        res.json({ error: 'missing _id' })
      }else{
        ISSUE.findByIdAndRemove(req.body._id, (err, doc)=>{
          if(err || doc == null){
            res.json({ error: 'could not delete', '_id': req.body._id })
          }else{
            res.json({  result: 'successfully deleted', '_id': req.body._id });
          }   
        })
      }
    }); 

};
