const jwt = require('jsonwebtoken'), config = require('../../env.config');

const Master = config.permissionLevels.Master;
const Member = config.permissionLevels.Member;
const Surfer = config.permissionLevels.Surfer;

exports.minimumPermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.jwt.roles);
        if (user_permission_level & required_permission_level) {
            return next();
        } else {
            
            return res.status(403).send({"error":"You don't have the permession Member!!"});
        }
    };
};

exports.onlySameUserOrAdminCanDoThisAction = (req, res, next) => {


    let user_permission_level = parseInt(req.jwt.roles);
    let email = req.jwt.email;
    if ((req.params && req.params.email && email === req.params.email)) {
        return next();
    } else {
        if (user_permission_level & Master) {
            return next();
        } else {
            return res.status(403).send({"error":"Only Admin and This User are allowed !!"});
        }
    }

};


exports.onlySameUserOrAdminOrSupervisorCanDoThisAction = (req, res, next) => {
    let user_permission_level = parseInt(req.jwt.roles);
    let email = req.jwt.email;
    let email_s = req.jwt.email_s;
    let email_u = req.jwt.email_u;
    if ((req.params && req.params.email && email === req.params.email)||(req.params && req.params.email && email_s === req.params.email)||(req.params && req.params.email && email_u === req.params.email)) {
        return next();
    } else {
        if (user_permission_level & Master) {
            return next();
        } else {
            return res.status(403).send({"error":"only same user or admin or supervisor"});
        }
    }

};

exports.sameUserCantDoThisAction = (req, res, next) => {
    let userId = req.jwt.userId;

    if (req.params.userId !== userId) {
        return next();
    } else {
        return res.status(400).send({"error":"Only User Can Do This !"});
    }

};
