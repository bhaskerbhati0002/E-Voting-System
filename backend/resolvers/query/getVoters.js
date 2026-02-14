const userService = require("../../services/userService");

const getVoters = async () => {
  return await userService.getVoters();
};

module.exports = getVoters;