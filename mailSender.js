const axios = require("axios");
const nodemailer = require("nodemailer");
const IP = require("ip");

const API_KEY = process.env.API_KEY;
const URL = "https://ipgeolocation.abstractapi.com/v1/?api_key=" + API_KEY;

const sendAPIRequest = async (ipAddress) => {
  const apiResponse = await axios.get(URL + "&ip_address=" + ipAddress);
  return apiResponse.data;
};

async function sendMail(req, res) {
  const ipaddresses = [
    req.ip,
    req.socket.remoteAddress,
    IP.address(),
    req.headers["x-forwarded-for"],
  ];

  var result = await sendAPIRequest(ipaddresses[2]);

  var sendResult = `IP - ${result.ip_address}\nCountry - ${result.country}\nCity - ${result.City}\nContinent - ${result.continent}`;

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
    text: sendResult,
  };

  transporter.sendMail(mailOptions);

  res.sendStatus(200);
}

module.exports = sendMail;
