const axios = require("axios");
const nodemailer = require("nodemailer");
const IP = require("ip");

const API_KEY = process.env.API_KEY;
const URL = "https://ipgeolocation.abstractapi.com/v1/?api_key=" + API_KEY;

const sendAPIRequest01 = async (ipAddress) => {
  const apiResponse = await axios.get(URL + "&ip_address=" + ipAddress);
  return apiResponse.data;
};

const sendAPIRequest02 = async (ipAddress) => {
  try {
    const apiResponse = await fetch("http://ip-api.com/json/" + ipAddress);
    const apiResponseJSON = await apiResponse.json();
    return apiResponseJSON;
  } catch (error) {
    console.error(error);
  }
};

async function sendMail(req, res) {
  const ipaddresses = [
    req.ip,
    req.socket.remoteAddress,
    IP.address(),
    req.headers["x-forwarded-for"],
  ];

  var result01 = await sendAPIRequest01(ipaddresses[2]);
  var result02 = await sendAPIRequest02(ipaddresses[2]);
  var result03 = await sendAPIRequest01(ipaddresses[1]);
  var result04 = await sendAPIRequest02(ipaddresses[1]);
  var result05 = await sendAPIRequest01(ipaddresses[0]);
  var result06 = await sendAPIRequest02(ipaddresses[0]);

  var sendResult = `${JSON.stringify(result01)}\n${JSON.stringify(
    result02
  )}\n${JSON.stringify(result03)}\n${JSON.stringify(
    result04
  )}\n${JSON.stringify(result05)}\n${JSON.stringify(result06)}`;

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
