const mongoose = require('mongoose');
mongoose.connect('mongodb://IOT:sedkiamine9695@ds117164.mlab.com:17164/smart_care',{useNewUrlParser: true});
const Schema = mongoose.Schema;

const identiySchema = new Schema({
    fullName: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    phone:{type:String,required:true},
    sexe:{type:String,required:true},
    stype:{type:String,required:true},
    lat:{type:String,required:true},
    lng:{type:String,required:true},
    name_s:{type:String,required:true},
    email_s:{type:String,required:true},
    phone_s:{type:String,required:true},
    permissionLevel: {type:Number,required:true}
    },
    {timestamps: true
});

identiySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
identiySchema.set('toJSON', {
    virtuals: true
});

identiySchema.findById = function (cb) {
    return this.model('Users').find({id: this.id}, cb);
};

const Identity = mongoose.model('Users', identiySchema);


exports.findByEmail = (email) => {
    return Identity.find({email: email});
};
exports.findById = (id) => {
    return Identity.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createIdentity = (userData) => {
    const user = new Identity(userData);
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Identity.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.putIdentity = (id,identityData) => {
    return new Promise((resolve, reject) => {
        Identity.findByIdAndUpdate(id,identityData,function (err,user) {
            if (err) reject(err);
            resolve(user);
        });
    });
};

exports.patchIdentity = (email, userData) => {
    return new Promise((resolve, reject) => {
        Identity.findOneAndUpdate({email: email},{ $set:userData}, function (err, user) {
            if (err) reject(err);
            resolve(user);
            
        });
    });
};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        Identity.remove({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
