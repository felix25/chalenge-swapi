const { getList } = require("./service/get-star-wars.service");

module.exports.main = async () => {
  try {
    const results = await getList();
    return {
      count: results.length,
      results,
    };
  } catch (error) {
    throw JSON.stringify(error);
  }
};