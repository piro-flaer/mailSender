require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const PORT = 6700;

app.set("trust proxy", true);

app.use("/", require("./mailSender"));

app.listen(PORT, () => {
  console.log(`Server Started`);
});
