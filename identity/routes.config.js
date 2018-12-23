const IdentityProvider = require('./controllers/identity.provider');
const SupervisorProvider = require('./controllers/supervisor.provider');
const AuthorizationValidation = require('../security/authorization/authorization.validation');
const AuthorizationPermission = require('../security/authorization/authorization.permission');
const config = require('../env.config');

const Master = config.permissionLevels.Master;
const Member = config.permissionLevels.Member;
const Surfer = config.permissionLevels.Surfer;

exports.routesConfig = function (app) {
    //Users route
    app.post('/users', [
        IdentityProvider.insert
    ]);
    app.get('/users', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Master),
        IdentityProvider.list
    ]);
    app.get('/users/:userId', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Member),
        AuthorizationPermission.onlySameUserOrAdminCanDoThisAction,
        IdentityProvider.getById
    ]);

        //Supervisors route
        app.post('/supers', [
            SupervisorProvider.insert
        ]);
        app.get('/supers', [
            AuthorizationValidation.validJWTNeeded,
            AuthorizationPermission.minimumPermissionLevelRequired(Master),
            SupervisorProvider.list
        ]);
        app.get('/supers/:userId', [
            AuthorizationValidation.validJWTNeeded,
            AuthorizationPermission.minimumPermissionLevelRequired(Member),
            AuthorizationPermission.onlySameUserOrAdminCanDoThisAction,
            SupervisorProvider.getById
        ]);


    /**
     * In a PUT request, the enclosed entity is considered to be
     * a modified version of the resource stored on the origin server,
     * and the client is requesting that the stored version be replaced.
     * So all the attributes are to be updated!
     * Thus this is a privileged action done only by administrator
     */
    //User route
    app.put('/users/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Master),
        AuthorizationPermission.sameUserCantDoThisAction,
        IdentityProvider.putByEmail
    ]);

    //Supervisor route
    app.put('/supers/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Master),
        AuthorizationPermission.sameUserCantDoThisAction,
        SupervisorProvider.putByEmail
    ]);

    /**
     * PATCH specifies that the enclosed entity contains a set of instructions describing
     * how a resource currently residing on the origin server should be modified to produce a new version.
     * So, some attributes could or should remain unchanged.
     * In our case, a regular user cannot change permissionLevel!
     * Thus only same user or admin can patch without changing identity permission level.
     */
    //User route
    app.patch('/users/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Member),
        AuthorizationPermission.onlySameUserOrAdminOrSupervisorCanDoThisAction,
        IdentityProvider.patchByEmail
    ]);
    app.delete('/users/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Master),
        AuthorizationPermission.sameUserCantDoThisAction,
        IdentityProvider.removeByEmail
    ]);

    //Supervisor route
    app.patch('/supers/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Member),
        AuthorizationPermission.onlySameUserOrAdminOrSupervisorCanDoThisAction,
        SupervisorProvider.patchByEmail
    ]);
    app.delete('/supers/:email', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Member),
        AuthorizationPermission.onlySameUserOrAdminOrSupervisorCanDoThisAction,
        SupervisorProvider.removeByEmail
    ]);
};