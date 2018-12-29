const mongoose = require('mongoose');
const config = require('../../env.config');
mongoose.connect(config.server_url,{useCreateIndex: true,useNewUrlParser: true,useFindAndModify:false});
const Schema = mongoose.Schema;

const emergencySchema = new Schema({
    email: {type:String,required:true,unique:true},
    status:{type:String,required:true}
    },
    {timestamps: true
});

emergencySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
emergencySchema.set('toJSON', {
    virtuals: true
});

emergencySchema.findById = function (cb) {
    return this.model('Emergencys').find({id: this.id}, cb);
};

const Emergency = mongoose.model('Emergencys', emergencySchema);


exports.findByEmail = (email) => {
    return Emergency.find({email: email});
};
exports.findById = (id) => {
    return Emergency.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createEmergency = (userData) => {
    const user = new Emergency(userData);
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Emergency.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, Emergencys) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Emergencys);
                }
            })
    });
};

exports.putEmergency = (id,EmergencyData) => {
    return new Promise((resolve, reject) => {
        EmergencyModel.find({email: id})
        .then((result) => {
        Emergency.findByIdAndUpdate(result._id,EmergencyData,function (err,user) {
            if (err) reject(err);
            resolve(user);
        });
    });
});
};

exports.patchEmergency = (email, userData) => {
    
    return new Promise((resolve, reject) => {
        Emergency.findOneAndUpdate({email: email},{ $set:userData}, function (err, user) {
            if (err) reject(err);
            resolve(user);
            
        });
    });
};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        Emergency.deleteOne({email: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
});
};

