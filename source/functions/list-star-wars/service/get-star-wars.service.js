const { dynamodb, TABLE_NAME } = require('../../../config/dynamodb');

/**
 * Retrieves a list of items from a DynamoDB table.
 *
 * This function performs a scan operation on the specified DynamoDB table
 * and returns all items found. If an error occurs during the scan, it throws
 * an error with additional information.
 *
 * @async
 * @function getList
 * @returns {Promise<Object[]>} A promise that resolves to an array of items
 *   from the DynamoDB table.
 * @throws {Error} Throws an error if the scan operation fails. The error object
 *   contains additional properties:
 *   - `httpStatus`: The HTTP status code (500 if the scan fails).
 *   - `errorType`: The error code from the DynamoDB SDK (e.g., `ValidationException`).
 */
const getList = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const { Items: list } = await dynamodb.scan(params).promise();
    return list;
  } catch (error) {
    console.error('error:', error);

    error.httpStatus = 500;
    error.errorType = error.code;

    throw error;
  }
};

module.exports = {
  getList
};
