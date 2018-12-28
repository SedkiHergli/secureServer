module.exports = {
    "port": 8443,
    "server_url": 'mongodb://IOT1:123456aa@ds117164.mlab.com:17164/smart_care' //'mongodb://IOT:123456@localhost:27017/smart_care',
    ,"appEndpoint": "https://localhost:8443",
    "apiEndpoint": "https://localhost:8443",
    "refresh_secret": "Oh!42My@Go6*d9753!",
    "jwtValidityTimeInSeconds": 3600,
    "environment": "dev",
    "permissionLevels": {
        "Surfer": 1,
        "Member": 4,
        "Master": 2147483647
    },
    "actualRefreshSecret": null,
    "initRefreshSecret": function () {
        this.actualRefreshSecret = this.refresh_secret.concat('$' + (new Date(Date.now())).toISOString());
    }
};