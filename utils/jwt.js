const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
<<<<<<< HEAD
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};
=======
  const token = jwt.sign(
    payload,
    'jwtSecret',
    { expiresIn: '30d' }
  )
  return token;
}
>>>>>>> 904add76086560c2f9ac80389b3d43588993660f

const isTokenValid = ({ token }) => jwt.verify(token, 'jwtSecret');

//Cookies
const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });
<<<<<<< HEAD
=======

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
  console.log(res);
};
>>>>>>> 904add76086560c2f9ac80389b3d43588993660f

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
<<<<<<< HEAD
  attachCookiesToResponse,
};
=======
  attachCookiesToResponse
}
>>>>>>> 904add76086560c2f9ac80389b3d43588993660f
