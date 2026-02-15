const userService = require("../../services/userService");

const updateUser = async (_, { userId, name }, context) => {
  if (!context.user) {
    throw new Error("Unauthorized");
  }

  if (context.user.role === "ADMIN") {
    return await userService.updateUser(userId, name);
  }

  if (context.user.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return await userService.updateUser(userId, name);
};

module.exports = updateUser;
