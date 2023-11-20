require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
const allowedOrigins = [
  "http://localhost:5174",
  "https://akshat-garg.netlify.app",
  "https://akshat-garg.netlify.app/",
  "https://mail-sender-exby.onrender.com",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("====>>>>>>>>>Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const PORT = 6700;

app.set("trust proxy", true);

app.use("/", require("./mailSender"));

// Update your routes to include the 'Access-Control-Allow-Origin' header
app.use("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://akshat-garg.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
