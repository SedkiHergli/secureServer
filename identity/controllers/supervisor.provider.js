const SupervisorModel = require('../models/supervisor.model');
const crypto = require('crypto');

exports.insert = (req, res) => {
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.scryptSync(req.body.password,salt,64,{N:16384}).toString("base64");
            req.body.password = salt + "$" + hash;
            req.body.permissionLevel = 4;
            SupervisorModel.createSupervisor(req.body)
                .then((result) => {
                    res.status(201).send({id: result._id});
                },(err) => { console.log(err); });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    SupervisorModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        }).catch(function (error) {
            console.error(error)
          });
};

exports.getById = (req, res) => {
    SupervisorModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        }).catch(function (error) {
            console.error(error)
          });
};

exports.putByEmail = (req, res) => {
    if (req.body.password) {
let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.scryptSync(req.body.password,salt,64,{N:16384}).toString("base64");
        req.body.password = salt + "$" + hash;
    }

            SupervisorModel.putSupervisor(req.params.email, req.body)
            .then((result)=>{
            req.status(204).send({});
        }).catch(function (error) {
            console.error(error)
          });  
};

exports.patchByEmail = (req, res) => {
    if (req.body.password) {

        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.scryptSync(req.body.password,salt,64,{N:16384}).toString("base64");
        req.body.password = salt + "$" + hash;
    }
    SupervisorModel.patchSupervisor(req.params.email, req.body).then((result) => {
        res.status(204).send(result);
    }).catch(function (error) {
        console.error(error)
      });
};

exports.removeByEmail = (req, res) => {
            SupervisorModel.removeById(req.params.email)
            .then((result)=>{
            res.status(204).send({});
        }).catch(function (error) {
            console.error(error)
          });
   
      
};