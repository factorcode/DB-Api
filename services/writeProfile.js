let AWS = require("aws-sdk")

let awsConfig = {
    "region" : "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
};

AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let save = (input) => new Promise((resolve) => {

    var params = {
        TableName: "profiles",
        Item:  input
    };
    docClient.put(params, function (err, data) {

        if (err) {
            console.log("users::save::error - " + JSON.stringify(err, null, 2));   
            resolve(err)                   ;
        } else {
            console.log("users::save::success" );    
            resolve(data);
        }
    });
});

const writeProfile = async (profileData) => { 

    let insert = {
        "email": profileData.email, 
        "userName": profileData.name,        
        "badges": [ 
        {
          id:1,
          badgeName: "1st Scan",
          achieved: false
        },
        {
          id:2,
          badgeName: "10th Scan",
          achieved: false
        },
        {
          id:3,
          badgeName: "1st Location",
          achieved: false
        },
        {
          id:4,
          badgeName: "Complex Object",
          achieved: false
        }],
        "history": []
      }

    try {
        let data = await save(profileData); 
        return data;
    }
    catch (e) {
        console.log(e);
    }    
}




module.exports = { writeProfile };