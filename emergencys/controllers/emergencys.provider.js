const EmergencyModel = require('../models/emergencys.model');
const saltRounds = 10;

exports.insert = (req, res) => {
    EmergencyModel.createEmergency(req.body)
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
    EmergencyModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getByEmail = (req, res) => {
    EmergencyModel.findByEmail(req.params.email)
        .then((result) => {
            delete result._id;
            delete result.__v;
            res.status(200).send(result);
        });
};

exports.putByEmail = (req, res) => {
    EmergencyModel.find({email: req.params.email})
        .then((result) => {
            EmergencyModel.putEmergency(result._id, req.body)
            .then((result)=>{
            req.status(204).send({});
        });
    });
};

exports.patchByEmail = (req, res) => {
    EmergencyModel.patchEmergency(req.params.email, req.body).then((result) => {
            res.status(204).send(result);
        });
};

exports.removeByEmail = (req, res) => {
    EmergencyModel.find({email: req.params.email})
        .then((result) => {
        EmergencyModel.removeById(result._id)
            .then((result)=>{
            res.status(204).send({});
        });
    });
};