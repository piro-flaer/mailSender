require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
const allowedOrigins = [
  "https://akshat-garg.com",
  "https://threejs-portfolio.akshat-garg.com",
  "https://akshat-garg.netlify.app",
  "https://threejs-akshat-garg.netlify.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback("====>>>>>>>>>Not allowed by CORS");
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
  console.log(`Server Started on port ${PORT}`);
});
