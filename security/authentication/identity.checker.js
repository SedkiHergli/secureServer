const IdentityModel = require('../../identity/models/identity.model');
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const validityTime = require('../../env.config.js').jwtValidityTimeInSeconds;

exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing email and password fields'});
    }
};

exports.isPasswordAndUserMatch = (req, res, next) => {
    IdentityModel.findByEmail(req.body.email)
        .then((user)=>{
            if(!user[0]){
                res.status(404).send({});
            }else{
                let passwordFields = user[0].password.split('$');
                let salt = passwordFields[0];
                let hash = crypto.scryptSync(req.body.password,salt,64,{N:16384}).toString("base64");
                if (hash === passwordFields[1]) {
                    var now = Math.floor(Date.now() / 1000);
                    req.body = {
                        //iss: 'urn:kaaniche.xyz',
                        //aud: 'urn:'+(req.get('origin')?req.get('origin'):"kaaniche.xyz"),
                        sub: user[0].email,
                        name: user[0].fullName,
                        userId: user[0]._id,
                        roles: user[0].permissionLevel,
                        jti: uuidv4(),
                        iat: now,
                        exp: now+validityTime,
                        sexe: user[0].sexe,
                        stype: user[0].stype,
                        phone: user[0].phone,
                        phone_s: user[0].phone_s,
                        name_s: user[0].name_s,
                        email_s: user[0].email_s,
                        lat: user[0].lat,
                        lng: user[0].lng
                    };
                    return next();
                } else {
                    return res.status(400).send({errors: ['Invalid e-mail or password']});
                }
            }}).catch((err) => next(err));
};

exports.isUserStillExistsWithSamePrivileges = (req, res, next) => {
    IdentityModel.findByEmail(req.body.sub)
        .then((user)=>{
            if(!user[0]){
                res.status(404).send({});
            }
            req.body.roles = user[0].permissionLevel;
            return next();
        });
};