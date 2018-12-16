const IdentityModel = require('../models/identity.model');
const crypto = require('crypto');
exports.insert = (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.scryptSync(req.body.password,salt,64,{N:16384}).toString("base64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = 4;
    IdentityModel.createIdentity(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        }).catch(function (error) {
            console.error(error)
          });    
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
    IdentityModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        }).catch(function (error) {
            console.error(error)
          });
};

exports.getById = (req, res) => {
    IdentityModel.findById(req.params.userId)
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
    IdentityModel.find({email: req.params.email})
        .then((result) => {
            IdentityModel.putIdentity(result._id, req.body)
            .then((result)=>{
            req.status(204).send({});
        }).catch(function (error) {
            console.error(error)
          });
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
    IdentityModel.patchIdentity(req.params.email, req.body).then((result) => {
        res.status(204).send(result);
    }).catch(function (error) {
        console.error(error)
      });
};

exports.removeByEmail = (req, res) => {
    IdentityModel.find({email: req.params.email})
        .then((result) => {
            IdentityModel.removeById(result._id)
            .then((result)=>{
            res.status(204).send({});
        }).catch(function (error) {
            console.error(error)
          });
    });
};