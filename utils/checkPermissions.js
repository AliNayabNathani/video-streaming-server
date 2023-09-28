const CustomError = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  // console.log("Request User:", requestUser);
  // console.log("Resource User ID:", resourceUserId, typeof resourceUserId);
  if (requestUser.roleId === "1") return;
  if (requestUser.id === resourceUserId.toString()) return;
  throw new CustomError.UnauthenticatedError(
    "Not authorized to access this route."
  );
};

module.exports = checkPermissions;
