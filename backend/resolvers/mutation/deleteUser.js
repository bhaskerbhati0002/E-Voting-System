const userService = require("../../services/userService");

const deleteUser = async (_, { userId }, { user }) => {
  if (!user) {
    throw new Error("Not authenticated");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Only admin can delete candidate");
  }

  return await userService.deleteUser(userId);
};

module.exports = deleteUser;

