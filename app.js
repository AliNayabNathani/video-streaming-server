require("dotenv").config();
require("express-async-errors");
const bodyParser = require("body-parser");
const expressip = require("express-ip");

//express
const express = require("express");
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

//rest of the packages
const path = require("path");
// const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");

//database
const { connectDB, dbConfig } = require("./db/connect");
const sequelize = require("./config/sequelize");
const pusher = require("./config/pusher");
const Subscription = require("./models/Subscription");

//routers
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/adminRoutes");
const clientRouter = require("./routes/clientRoutes");
const otherRouter = require("./routes/otherRoutes");
const contentCreatorRouter = require("./routes/contentCreatorRoutes");
const statsRouter = require("./routes/statsRoutes");
const userRouter = require("./routes/userRoutes");

//import middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);
app.use(xss());

// app.use(morgan('tiny'));

//access to json data in req.body
app.use(express.json());
app.use(cookieParser("jwtSecret"));

app.use(bodyParser.json());
app.use(expressip().getIpInfoMiddleware);

// app.use(express.static("./public"));
app.use(fileUpload());


// app.use(auth(config));
//routes

// app.get("/", (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
// });

// app.use(
//   "public",
//   express.static(path.join(__dirname, "public"))
// );
app.use("/uploadPicture", express.static(path.join(__dirname, "public/uploads/posters/")));
app.use("/uploadVideos", express.static(path.join(__dirname, "public/uploads/vidoes/")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", adminRouter);
app.use("/api/v1/other", otherRouter);
app.use("/api/v1/stats", statsRouter);
app.use("/api/v1/creator", contentCreatorRouter);
app.use("/api/v1/client", clientRouter);
app.use("/api/v1/user", userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const io = new Server(server, {
  cors: {
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin: ["http://localhost:3000", "http://localhost:3001"],
  }
})
console.log(server);

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

sequelize
  .sync()
  .then(() => {
    console.log("Database synced.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

Subscription.startCron();
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB();
    console.log("Connected to PostgreSQL database.");

    server.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
  }
};

start();
