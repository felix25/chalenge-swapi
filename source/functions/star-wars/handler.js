
const { BASE_URL_DEFAULT, REPLACE_KEYS, exportData, changeKeyObjects } = require('../../utils/helpers');
const { saveDynamoDB } = require('./service/save-star-wars.service');

module.exports.main = async (event) => {
  const { page } = event;
  try {
    const response = await exportData(`${BASE_URL_DEFAULT}${page}`);
    const [ data ] = changeKeyObjects([response], REPLACE_KEYS);
    await saveDynamoDB(data);
    return data;
  } catch (error) {
    throw JSON.stringify(error);
  }
};