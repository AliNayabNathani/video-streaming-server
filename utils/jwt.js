const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, "jwtSecret", { expiresIn: "30d" });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, "jwtSecret");

//Cookies
const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: true,
    signed: true,
    sameSite: "None",
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
