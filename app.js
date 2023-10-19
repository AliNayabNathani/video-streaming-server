require("dotenv").config();
require("express-async-errors");

//express
const express = require("express");
const app = express();


//rest of the packages
const path = require('path');
// const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
// const rateLimiter = require("express-rate-limit");
// const helmet = require("helmet");
// const xss = require("xss-clean");
const cors = require("cors");

//database
const { connectDB, dbConfig } = require("./db/connect");
const sequelize = require("./config/sequelize");
const pusher = require("./config/pusher");

//routers
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/adminRoutes");
const clientRouter = require("./routes/clientRoutes");
const otherRouter = require("./routes/otherRoutes");
const contentCreatorRouter = require("./routes/contentCreatorRoutes");
const statsRouter = require("./routes/statsRoutes");
const userRouter = require('./routes/userRoutes');

//import middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// // Serve files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Define a route to serve images
// app.get('/images/:imageName', (req, res) => {
//   const { imageName } = req.params;
//   console.log(imageName);
//   const imagePath = path.join(__dirname, 'public', imageName);

//   // Check if the file exists before sending it
//   if (fs.existsSync(imagePath)) {
//     res.sendFile(imagePath);
//   } else {
//     res.status(404).send('Image not found');
//   }
// });

// app.set("trust proxy", 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 60,
//   })
// );
// app.use(helmet());
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);
// app.use(xss());

// app.use(morgan('tiny'));

//access to json data in req.body
app.use(express.json());
app.use(cookieParser('jwtSecret'));

// app.use(express.static("./public"));
app.use(fileUpload());
// app.use(auth(config));
//routes

// app.get("/", (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
// });

app.use(
  "public",
  express.static(path.join(__dirname, "public"))
);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", adminRouter);
app.use("/api/v1/other", otherRouter);
app.use("/api/v1/stats", statsRouter);
app.use("/api/v1/creator", contentCreatorRouter);
app.use("/api/v1/client", clientRouter);
app.use('/api/v1/user', userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

sequelize
  .sync()
  .then(() => {
    console.log("Database synced.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB();
    console.log("Connected to PostgreSQL database.");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
  }
};

start();
