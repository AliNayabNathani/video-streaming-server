const createTokenUser = (user) => {
  // console.log("token user", user);
  return {
    name: user.name,
    userId: user.id,
    roleId: user.role_id,
    email: user.email,
  };
};

module.exports = createTokenUser;
