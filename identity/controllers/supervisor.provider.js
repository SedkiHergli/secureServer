const SupervisorModel = require('../models/supervisor.model');
const bcrypt = require('bcrypt');
saltRounds=10;
exports.insert = (req, res) => {
    bcrypt.genSalt(saltRounds).then(function(salt) {
        bcrypt.hash(req.body.password, salt).then(function(hash) {
            req.body.password = hash;
            req.body.permissionLevel = 4;
            SupervisorModel.createSupervisor(req.body)
                .then((result) => {
                    res.status(201).send({id: result._id});
                },(err) => { console.log(err); });

        },(err) => { console.log(err); });
    }).catch((err) => next(err));
    /*let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.scryptSync(req.body.password,salt,64,{N:16384}).toString("base64");
    req.body.password = salt + "$" + hash;*/

    
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
        })
};

exports.getById = (req, res) => {
    SupervisorModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.putByEmail = (req, res) => {
    if (req.body.password) {
        bcrypt.genSalt(saltRounds).then(function(salt) {
            bcrypt.hash(req.body.password, salt).then(function(hash) {
                req.body.password = hash;
            },(err) => { console.log(err); });
        }).catch((err) => next(err));
        /*let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.scryptSync(req.body.password,salt,64,{N:16384}).toString("base64");
        req.body.password = salt + "$" + hash;*/
    }
    SupervisorModel.find({email: req.params.email})
        .then((result) => {
            SupervisorModel.putSupervisor(result._id, req.body)
            .then((result)=>{
            req.status(204).send({});
        });
    });    
};

exports.patchByEmail = (req, res) => {
    if (req.body.password) {

       bcrypt.genSalt(saltRounds).then(function(salt) {
            bcrypt.hash(req.body.password, salt).then(function(hash) {
                req.body.password = hash;
            },(err) => { console.log(err); });
        }).catch((err) => next(err));
        /*let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.scryptSync(req.body.password,salt,64,{N:16384}).toString("base64");
        req.body.password = salt + "$" + hash;*/
    }
    SupervisorModel.patchSupervisor(req.params.email, req.body).then((result) => {
        res.status(204).send(result);
    });
};

exports.removeByEmail = (req, res) => {
    SupervisorModel.find({email: req.params.email})
        .then((result) => {
            SupervisorModel.removeById(result._id)
            .then((result)=>{
            res.status(204).send({});
        });
    });
};