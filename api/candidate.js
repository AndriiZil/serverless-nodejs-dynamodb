'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = async (event, context, callback) => {
    console.log('EVENT', event);

    const requestBody = JSON.parse(event.body);
    const { fullname, email, experience } = requestBody;

    if (typeof fullname !== 'string' || typeof email !== 'string' || typeof experience !== 'number') {
        console.error('Validation Failed');
        return callback(new Error('Couldn\'t submit candidate because of validation errors.'));
    }

    try {
        const { id } = await submitCandidateP(candidateInfo(fullname, email, experience));
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully submitted candidate with email ${email}`,
                candidateId: id
            })
        });
    } catch (err) {
        console.log(err);
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({
                message: `Unable to submit candidate with email ${email}`
            })
        })
    }

};


const submitCandidateP = async (candidate) => {
    const params = {
        TableName: process.env.CANDIDATE_TABLE,
        Item: candidate,
    };
    return dynamoDb.put(params).promise();
};

const candidateInfo = (fullname, email, experience) => {
    const timestamp = new Date().getTime();
    return {
        id: uuid.v1(),
        fullname: fullname,
        email: email,
        experience: experience,
        submittedAt: timestamp,
        updatedAt: timestamp,
    };
};

module.exports.list = async (event, context, callback) => {
    console.log('EVENT', event);

    const params = {
        TableName: process.env.CANDIDATE_TABLE,
        ProjectionExpression: "id, fullname, email"
    };

    try {
        const { Items } = await dynamoDb.scan(params).promise();

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                candidates: Items
            })
        });
    } catch (err) {
        console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
        callback(err);
    }
};

module.exports.get = async (event, context, callback) => {
    console.log('EVENT', event);

    const params = {
        TableName: process.env.CANDIDATE_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
    };

    try {
        const { Item } = await dynamoDb.get(params).promise();

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(Item),
        });
    } catch (err) {
        console.error(err);
        return callback(new Error('Couldn\'t fetch candidate.'));
    }
};
