const jwt = require('jsonwebtoken'),
refreshSecret = require('../../env.config.js').actualRefreshSecret,
crypto = require('crypto');
fs = require('fs');

const cert = fs.readFileSync('./tls/token-public-key.pem');

exports.validJWTNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                //var aud = 'urn:'+(req.get('origin')?req.get('origin'):"kaaniche.xyz");
                req.jwt = jwt.verify(authorization[1], cert, {algorithms: ['RS512']});
                return next();
            }
        } catch (err) {
            return res.status(403).send({"error":"Token invalid"});
        }
    } else {
        return res.status(401).send({"error":"No authorization headers"});
    }
};

exports.verifyRefreshBodyField = (req, res, next) => {
    if (req.body && req.body.refresh_token) {
        return next();
    } else {
        return res.status(400).send({error: 'need to pass refresh_token field'});
    } 
};

exports.validRefreshNeeded = (req, res, next) => {
    let decoded = req.body.refresh_token.split('$');
    let salt = decoded[0].toString('base64');
    let refresh_token = decoded[1];
    let hash = crypto.createHmac('sha512', salt).update(req.jwt.userId + refreshSecret + req.jwt.jti).digest("base64");
    let bb = Buffer.from(hash);
    hash = bb.toString('base64');
    if (hash === refresh_token) {
        req.body = req.jwt;
        return next();
    } else {
        return res.status(400).send({error: 'Invalid refresh token'});
    }
};