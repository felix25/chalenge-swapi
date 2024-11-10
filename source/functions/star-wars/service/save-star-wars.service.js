const { dynamodb, TABLE_NAME } = require('../../../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

/**
 * Checks if a record with the specified name already exists in the DynamoDB table.
 *
 * This function queries the DynamoDB table to see if a record with the same
 * "nombre" (name) already exists. If it does, an error is thrown indicating
 * that the record already exists.
 *
 * @async
 * @function checkIfNameExistsInDatabase
 * @param {string} nombre - The name to check in the database.
 * @throws {Error} Throws an error if the name already exists in the database.
 */
const checkIfNameExistsInDatabase = async({ nombre }) => {
  const checkParams = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'nombre = :nombre',
    ExpressionAttributeValues: {
      ':nombre': nombre,
    },
  };
  const result = await dynamodb.query(checkParams).promise();

  if (result.Items && result.Items.length > 0) {
    throw new Error(`The record with name "${nombre}" already exists in the database.`);
  }
};

/**
 * Saves a new record to DynamoDB, checking if the name already exists.
 *
 * This function first checks if a record with the same "nombre" exists in the DynamoDB table.
 * If the name does not exist, it proceeds to save the new record. The record is either
 * provided with an existing ID or a new ID generated using `uuidv4()`. The function uses 
 * the `batchWrite` operation to save the record to DynamoDB.
 *
 * @async
 * @function saveDynamoDB
 * @param {Object} data - The data to save to DynamoDB.
 * @param {string} data.id - The ID for the new record (optional; a new ID is generated if not provided).
 * @param {string} data.nombre - The name of the record to save.
 * @throws {Error} Throws an error if the save operation to DynamoDB fails.
 * @returns {Promise<void>} Resolves when the item is successfully saved to DynamoDB.
 */
const saveDynamoDB = async (data) => {
  const item = {
    id: data.id || uuidv4(),
    ...data,
  };
  
  await checkIfNameExistsInDatabase({ nombre: item.nombre});

  const params = {
    RequestItems: {
      [TABLE_NAME]: [
        {
          PutRequest: { Item: item },
        },
      ],
    },
  };

  try {
    await dynamodb.batchWrite(params).promise();
  } catch (error) {
    console.error(
      'ERROR EN DYNAMO DB JSON: ',
      JSON.stringify(error, null, 2),
      '\nEvent: ',
      JSON.stringify(params, null, 2),
    );
    throw error;
  }
};

module.exports = {
  saveDynamoDB
};
