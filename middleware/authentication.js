const CustomError = require("../errors");
const Role = require("../models/Role");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }

  try {
    const { name, userId, roleId } = isTokenValid({ token }); //role
    req.user = { name, userId, roleId }; //role
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

// const authorizePermission = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.roleId)) {
//       throw new CustomError.UnauthenticatedError(
//         "Unauthorized to access this route"
//       );
//     }
//     next();
//   };
// };

const authorizePermission = (...allowedRoleNames) => {
  return async (req, res, next) => {
    const roleId = req.user.roleId;

    const role = await Role.findByPk(roleId);

    if (!role) {
      throw new Error("Role not found");
    }

    const role_Id = role.id;

    if (!allowedRoleNames.includes(role_Id)) {
      throw new Error("Unauthorized to access this route");
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermission,
};
