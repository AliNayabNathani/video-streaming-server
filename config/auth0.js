const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: "http://localhost:5000",
  clientID: "BknCW0P9iBBNImDyOpInrcZ9GInK28pX",
  issuerBaseURL: "https://dev-bybpbcs5qojds1pc.us.auth0.com",
};

module.exports = config;
