const LocationModel = require('../models/locations.model');
const saltRounds = 10;

exports.insert = (req, res) => {
    LocationModel.createLocation(req.body)
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
    LocationModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getByEmail = (req, res) => {
    LocationModel.findByEmail(req.params.email)
        .then((result) => {
            delete result._id;
            delete result.__v;
            res.status(200).send(result);
        });
};

exports.putByEmail = (req, res) => {
            LocationModel.putLocation(req.params.email, req.body)
            .then((result)=>{
            req.status(204).send({});
        });
};

exports.patchByEmail = (req, res) => {
    LocationModel.patchLocation(req.params.email, req.body).then((result) => {
            res.status(204).send(result);
        });
};

exports.removeByEmail = (req, res) => {
        LocationModel.removeById(req.params.email)
            .then((result)=>{
            res.status(204).send({});
        });
};