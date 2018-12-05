const EmergencyProvider = require('./controllers/emergencys.provider');
const AuthorizationValidation = require('../security/authorization/authorization.validation');
const AuthorizationPermission = require('../security/authorization/authorization.permission');
const config = require('../env.config');

const Master = config.permissionLevels.Master;
const Member = config.permissionLevels.Member;
const Surfer = config.permissionLevels.Surfer;

exports.routesConfig = function (app) {
    //Emergencys route
    app.post('/Emergencys', [
        EmergencyProvider.insert
    ]);
    app.get('/Emergencys', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Master),
        EmergencyProvider.list
    ]);
    app.get('/Emergencys/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Member),
        AuthorizationPermission.onlySameUserOrAdminOrSupervisorCanDoThisAction,
        EmergencyProvider.getByEmail
    ]);

    /**
     * In a PUT request, the enclosed entity is considered to be
     * a modified version of the resource stored on the origin server,
     * and the client is requesting that the stored version be replaced.
     * So all the attributes are to be updated!
     * Thus this is a privileged action done only by administrator
     */
    //User route
    app.put('/Emergencys/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Master),
        AuthorizationPermission.onlySameUserOrAdminOrSupervisorCanDoThisAction,
        EmergencyProvider.putByEmail
    ]);

    /**
     * PATCH specifies that the enclosed entity contains a set of instructions describing
     * how a resource currently residing on the origin server should be modified to produce a new version.
     * So, some attributes could or should remain unchanged.
     * In our case, a regular user cannot change permissionLevel!
     * Thus only same user or admin can patch without changing identity permission level.
     */
    //User route
    app.patch('/Emergencys/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Member),
        AuthorizationPermission.onlySameUserOrAdminCanDoThisAction,
        EmergencyProvider.patchByEmail
    ]);
    app.delete('/Emergencys/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Master),
        AuthorizationPermission.sameUserCantDoThisAction,
        EmergencyProvider.removeByEmail
    ]);

};