const { DynamoDB } = require('aws-sdk');

const dynamodb = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1',
  apiVersion: '2012-08-10',
  convertEmptyValues: true,
});

const TABLE_NAME = process.env.TABLE_NAME;

module.exports = {
  dynamodb,
  TABLE_NAME
};