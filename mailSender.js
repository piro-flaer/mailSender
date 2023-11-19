const axios = require("axios");
const nodemailer = require("nodemailer");
const IP = require("ip");

const API_KEY = process.env.API_KEY;
const URL = "http://ip-api.com/json/";

const sendAPIRequest = async (ipAddress) => {
  console.log(ipAddress);
  try {
    const apiResponse = await fetch("http://ip-api.com/json/" + ipAddress);
    const apiResponseJSON = await apiResponse.json();
    return apiResponseJSON;
  } catch (error) {
    console.error(error);
  }
  console.log(apiResponseJSON);
};

async function sendMail(req, res) {
  const ipaddresses = [
    req.ip,
    req.socket.remoteAddress,
    IP.address(),
    req.headers["x-forwarded-for"],
  ];

  var result = await sendAPIRequest(ipaddresses[2]);

  console.log(result);

  // var sendResult = `IP - ${result.ip_address}\nCountry - ${result.country}\nCity - ${result.City}\nContinent - ${result.continent}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: "akshatg805@gmail.com",
    subject: "Someone came",
    text: JSON.stringify(result),
  };

  transporter.sendMail(mailOptions);

  res.sendStatus(200);
}

module.exports = sendMail;
