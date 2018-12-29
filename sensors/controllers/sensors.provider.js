const SensorModel = require('../models/sensors.model');


exports.insert = (req, res) => {
    SensorModel.createSensor(req.body)
    .then((result) => {
        res.status(201).send({id: result._id});
    },(err) => { res.status(400).send({"error":"We can't create sensor table"});});    
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
    SensorModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getByEmail = (req, res) => {
    SensorModel.findByEmail(req.params.email)
        .then((result) => {
            delete result._id;
            delete result.__v;
            res.status(200).send(result);
        });
};

exports.putByEmail = (req, res) => {

            SensorModel.putSensor(req.params.email, req.body)
            .then((result)=>{
            req.status(204).send({});
        });

};

exports.patchByEmail = (req, res) => {
    SensorModel.patchSensor(req.params.email, req.body).then((result) => {
            res.status(204).send(result);
        });
};

exports.removeByEmail = (req, res) => {
        SensorModel.removeById(req.params.email)
            .then((result)=>{
            res.status(204).send({});
        }).catch(function (error) {
            console.error(error)
          });;
};