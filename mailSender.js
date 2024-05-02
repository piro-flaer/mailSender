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
  const ipaddresses = [req.ip, req.socket.remoteAddress, IP.address()];

  var result05 = await sendAPIRequest01(ipaddresses[0]);
  var result06 = await sendAPIRequest02(ipaddresses[0]);

  var sendResult = `Result 05\nIP - ${result05.ip_address}\nCity - ${
    result05.city
  }\nRegion - ${result05.region}\nCountry - ${result05.country}\nContinent - ${
    result05.continent
  }\nLongitude - ${result05.longitude}\nLatitude - ${result05.latitude}\n\n\n
  Result 06\nStatus - ${result06.status}\nIP - ${result06.query} ${
    result06.status === "success" &&
    `\nCountry - ${result06.country}\nRegion - ${result06.region}\nCity - ${result06.city}\nLongitude - ${result06.lon}\nLatitude - ${result06.lat}`
  }\n\n\n`;

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
    subject: `Someone came req.header("origin")`,
    text: sendResult,
  };

  transporter.sendMail(mailOptions);

  res.sendStatus(200);
}

module.exports = sendMail;
