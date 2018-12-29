const mongoose = require('mongoose');
const config = require('../../env.config');
mongoose.connect(config.server_url,{useCreateIndex: true,useNewUrlParser: true,useFindAndModify:false});
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    email: {type:String,required:true,unique:true},
    lat:{type:String,required:true},
    lng:{type:String,required:true}
    },
    {timestamps: true
});

locationSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
locationSchema.set('toJSON', {
    virtuals: true
});

locationSchema.findById = function (cb) {
    return this.model('Locations').find({id: this.id}, cb);
};

const Location = mongoose.model('Locations', locationSchema);


exports.findByEmail = (email) => {
    return Location.find({email: email});
};
exports.findById = (id) => {
    return Location.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createLocation = (userData) => {
    const user = new Location(userData);
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Location.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, Locations) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Locations);
                }
            })
    });
};

exports.putLocation = (id,LocationData) => {
    return new Promise((resolve, reject) => {
        LocationModel.find({email: id})
        .then((result) => {
        Location.findByIdAndUpdate(result._id,LocationData,function (err,user) {
            if (err) reject(err);
            resolve(user);
        });
    });
});
};

exports.patchLocation = (email, userData) => {
    
    return new Promise((resolve, reject) => {
        Location.findOneAndUpdate({email: email},{ $set:userData}, function (err, user) {
            if (err) reject(err);
            resolve(user);
            
        });
    });
};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        Location.deleteOne({email: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

