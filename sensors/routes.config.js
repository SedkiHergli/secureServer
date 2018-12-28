const SensorProvider = require('./controllers/sensors.provider');
const AuthorizationValidation = require('../security/authorization/authorization.validation');
const AuthorizationPermission = require('../security/authorization/authorization.permission');
const config = require('../env.config');
const SensorModel = require('./models/sensors.model');

const Master = config.permissionLevels.Master;
const Member = config.permissionLevels.Member;
const Surfer = config.permissionLevels.Surfer;

var mqtt = require('mqtt');
var options = {
    port: 17593,
    host: 'mqtt://m21.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'med',
    password: '1995',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var client = mqtt.connect('mqtt://m21.cloudmqtt.com', options);

client.on('connect', function() { // When connected
    console.log('connected');
    // subscribe to a topic
    client.subscribe('sensors', function() {
        // when a message arrives, do something with it
        client.on('message', function(topic, message, packet) {
          var objectValue = JSON.parse(message);
            var data =  {
                "temperature" : objectValue.d.temperature,
                "humidity":objectValue.d.humidity,
                "current":objectValue.d.current,
                "voltage":objectValue.d.voltage
                } 
            SensorModel.patchSensor(objectValue.d.email, data).then((result) => {
                //res.status(204).send(result);
            });
              });
        });
});


exports.routesConfig = function (app) {
    //Sensors route
    app.post('/Sensors', [
        SensorProvider.insert
    ]);
    app.get('/Sensors', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Master),
        SensorProvider.list
    ]);
    app.get('/Sensors/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Member),
        AuthorizationPermission.onlySameUserOrAdminOrSupervisorCanDoThisAction,
        SensorProvider.getByEmail
    ]);

    /**
     * In a PUT request, the enclosed entity is considered to be
     * a modified version of the resource stored on the origin server,
     * and the client is requesting that the stored version be replaced.
     * So all the attributes are to be updated!
     * Thus this is a privileged action done only by administrator
     */
    //User route
    app.put('/Sensors/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Master),
        AuthorizationPermission.onlySameUserOrAdminOrSupervisorCanDoThisAction,
        SensorProvider.putByEmail
    ]);

    /**
     * PATCH specifies that the enclosed entity contains a set of instructions describing
     * how a resource currently residing on the origin server should be modified to produce a new version.
     * So, some attributes could or should remain unchanged.
     * In our case, a regular user cannot change permissionLevel!
     * Thus only same user or admin can patch without changing identity permission level.
     */
    //User route
    app.patch('/Sensors/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Member),
        AuthorizationPermission.onlySameUserOrAdminCanDoThisAction,
        SensorProvider.patchByEmail
    ]);
    app.delete('/Sensors/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Master),
        AuthorizationPermission.sameUserCantDoThisAction,
        SensorProvider.removeByEmail
    ]);

};