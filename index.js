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

app.listen(PORT, () => {
  console.log(`Server Started`);
});
