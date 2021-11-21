var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let callDBApi = (userId) => new Promise((resolve) => {

    var params = {
        TableName: "profiles",
        Key: {
            "email": userId
        }
    };

    docClient.get(params, function (err, data) {
        if (err) {
            resolve(err);
            console.log("profiles::error - " + JSON.stringify(err, null, 2));
        }
        else {
            resolve(data);
            console.log("profiles::success - " + JSON.stringify(data, null, 2));
        }
    })
});


const getProfile = async (userId) => { 

    try {
        let data = await callDBApi(userId); 
        return data;
    }
    catch (e) {
        console.log(e);
    }    
}

module.exports = { getProfile };