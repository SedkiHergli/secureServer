const mongoose = require('mongoose');
const config = require('../../env.config');
mongoose.connect(config.server_url,{useCreateIndex: true,useNewUrlParser: true,useFindAndModify:false});
const Schema = mongoose.Schema;

const superSchema = new Schema({
    fullName: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    phone:{type:String,required:true},
    stype:{type:String,required:true},
    name_u:{type:String,required:true},
    email_u:{type:String,required:true},
    phone_u:{type:String,required:true},
    permissionLevel: {type:Number,required:true}
    },
    {timestamps: true
});

superSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
superSchema.set('toJSON', {
    virtuals: true
});

superSchema.findById = function (cb) {
    return this.model('Supers').find({id: this.id}, cb);
};

const Supervisor = mongoose.model('Supers', superSchema);


exports.findByEmail = (email) => {
    return Supervisor.find({email: email});
};
exports.findById = (id) => {
    return Supervisor.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createSupervisor = (userData) => {
    const user = new Supervisor(userData);
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Supervisor.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, Supers) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Supers);
                }
            })
    });
};

exports.putSupervisor = (id,SupervisorData) => {
    return new Promise((resolve, reject) => {
        Supervisor.find({email: id})
        .then((result) => {
        Supervisor.findByIdAndUpdate(result._id,SupervisorData,function (err,user) {
            if (err) reject(err);
            resolve(user);
        });
    });
});
};

exports.patchSupervisor = (email, userData) => {
    return new Promise((resolve, reject) => {
        Supervisor.findOneAndUpdate({email: email},{ $set:userData}, function (err, user) {
            if (err) reject(err);
            resolve(user);
            
        });
    });
};

exports.removeById = (email) => {
    return new Promise((resolve, reject) => {
        Supervisor.deleteOne({email: email}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

