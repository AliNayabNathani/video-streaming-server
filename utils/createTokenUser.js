const createTokenUser = (user) => {
  // console.log(user);
  return {
    name: user.name,
    userId: user.id,
  };
};

module.exports = createTokenUser;
