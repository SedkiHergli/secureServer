const config = require('./env.config.js');

const express = require('express');
const main = express();
const bodyParser = require('body-parser');

const SecurityRouter = require('./security/routes.config');
const IdentityRouter = require('./identity/routes.config');
const LocationRouter = require('./locations/routes.config');
const EmergencyRouter = require('./emergencys/routes.config');
const SensorRouter = require('./sensors/routes.config');

config.initRefreshSecret();

//voir  Helmet.md
const tls = require('spdy'); //http2 + https (tls)
const fs = require('fs');
let helmet = require('helmet');//pour sécuriser TLS

const options = {
    key: fs.readFileSync('./tls/test-key.pem'),
    cert: fs.readFileSync('./tls/test-cert.pem')
};//cert ou clé public(full chaine) et le premier est le clé privé(priv) lindscime ou l'indscript(stocker sur disque dur ces fichiers) 

main.use(helmet());


main.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});//handler qui gere CORS pour la réquete soit activer de plusieur nom de domaine(plusieur serveur qu'on veut invoquer notre api(weather))

main.use(bodyParser.json());//handler
SecurityRouter.routesConfig(main);
IdentityRouter.routesConfig(main);
LocationRouter.routesConfig(main);
SensorRouter.routesConfig(main);
EmergencyRouter.routesConfig(main);

tls.createServer(options, main).listen(config.port, (error) => {
        if (error) {
            console.error(error);
            return process.exit(1)
        } else {
            console.log('express main configured with HTTP2 and TLSv1.2 and listening on port: ' + config.port + '.')
        }
    });
