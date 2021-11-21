var AWS = require("aws-sdk");
const { getProfile } = require('./getProfile')
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();


let updateUserName = (userId, newUserName) => new Promise((resolve) => {

    var params = {
        TableName: "profiles",
        Key: { "email": userId },
        UpdateExpression: "set userName = :name",
        ExpressionAttributeValues: {
            ":name": newUserName,
        },
        ReturnValues: "UPDATED_NEW"

    };

    docClient.update(params, function (err, data) {
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

let modifyHistory = (userId, newHistory) => new Promise((resolve) => {

    const updateExp = "set history = :value"

    const params = {
        TableName: "profiles",
        Key: { "email": userId },
        UpdateExpression: updateExp,
        ExpressionAttributeValues: {
            ":value": newHistory,
        },
        ReturnValues: "UPDATED_NEW"

    };
    docClient.update(params, function (err, data) {

        if (err) {
            resolve(err);
            console.log("profiles::error - " + JSON.stringify(err, null, 2));
        }
        else {
            resolve(data);
            console.log("profiles::success - " + JSON.stringify(data, null, 2));
        }
    });
});

let modifyBadges = (userId, badgeId, newBadgeValue) => new Promise((resolve) => {

    let badgeArrayPosition = badgeId - 1;
    const updateExp = "set badges[" + badgeArrayPosition + "].achieved = :value"

    const params = {
        TableName: "profiles",
        Key: { "email": userId },
        UpdateExpression: updateExp,
        ExpressionAttributeValues: {
            ":value": newBadgeValue,
        },
        ReturnValues: "UPDATED_NEW"

    };
    docClient.update(params, function (err, data) {

        if (err) {
            resolve(err);
            console.log("profiles::error - " + JSON.stringify(err, null, 2));
        }
        else {
            resolve(data);
            console.log("profiles::success - " + JSON.stringify(data, null, 2));
        }
    });
});

const updateProfileName = async (userId, newUserName) => {

    try {
        let data = await updateUserName(userId, newUserName);
        return data;
    }
    catch (e) {
        console.log(e);
    }
}

const updateProfileHistory = async (userId, newItem) => {


    const completeProfile = await getProfile(userId);
    let newHistory = []

    if (completeProfile.Item.history) {
        let updates;
        if(completeProfile.Item.history.length == 5)
        {
            updates = completeProfile.Item.history;
            updates.pop();
        }           

        newHistory = updates ? [newItem].concat(updates) : [newItem].concat(completeProfile.Item.history)
    }

    try {
        let data = await modifyHistory(userId, newHistory);
        return data;
    }
    catch (e) {
        console.log(e);
    }
}

const updateProfileBadge = async (userId, badgedata) => {

    try {
        let data = await modifyBadges(userId, badgedata.id, badgedata.value);
        return data;
    }
    catch (e) {
        console.log(e);
    }
}

// * TEST DATA 

// let badgedata = {id: 3, value: false}

// let historyItem = {
//     itemName: "New Item Last 2",
//     imgPath: 'https://picsum.photos/200/300',
//     scannedDate: "21 Oct 2021",
//     scannedTime: "10:12am"
//   }

module.exports = { updateProfileName, updateProfileHistory, updateProfileBadge };
