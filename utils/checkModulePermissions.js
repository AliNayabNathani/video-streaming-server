const CustomError = require("../errors");

const checkModulePermissions = (requestUser, resourceUserId) => {
  // console.log("Request User:", requestUser);
  // console.log("Resource User ID:", resourceUserId, typeof resourceUserId);
  //   if (requestUser.role_id === 1) return;
  //   if (requestUser.id === resourceUserId.toString()) return;
  throw new CustomError.UnauthenticatedError(
    "Not authorized to access this route."
  );
};

module.exports = checkModulePermissions;
