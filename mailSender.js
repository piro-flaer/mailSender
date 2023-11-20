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

  var result01 = await sendAPIRequest01(ipaddresses[2]);
  var result02 = await sendAPIRequest02(ipaddresses[2]);

  await new Promise((resolve) => setTimeout(resolve, 1500));
  var result03 = await sendAPIRequest01(ipaddresses[1]);
  var result04 = await sendAPIRequest02(ipaddresses[1]);

  await new Promise((resolve) => setTimeout(resolve, 1500));
  var result05 = await sendAPIRequest01(ipaddresses[0]);
  var result06 = await sendAPIRequest02(ipaddresses[0]);

  var sendResult = `Result 01\nIP - ${result01.ip_address}\nCity - ${
    result01.city
  }\nRegion - ${result01.region}\nCountry - ${result01.country}\nContinent - ${
    result01.continent
  }\nLongitude - ${result01.longitude}\nLatitude - ${result01.latitude}\n\n\n
  Result 02\nStatus - ${result02.status}\nIP - ${result02.query} ${
    result02.status === "success" &&
    `\nCountry - ${result02.country}\nRegion - ${result02.region}\nCity - ${result02.city}\nLongitude - ${result02.lon}\nLatitude - ${result02.lat}`
  }\n\n\nResult 03\nIP - ${result03.ip_address}\nCity - ${
    result03.city
  }\nRegion - ${result03.region}\nCountry - ${result03.country}\nContinent - ${
    result03.continent
  }\nLongitude - ${result03.longitude}\nLatitude - ${result03.latitude}\n\n\n
  Result 04\nStatus - ${result04.status}\nIP - ${result04.query} ${
    result04.status === "success" &&
    `\nCountry - ${result04.country}\nRegion - ${result04.region}\nCity - ${result04.city}\nLongitude - ${result04.lon}\nLatitude - ${result04.lat}`
  }\n\n\nResult 05\nIP - ${result05.ip_address}\nCity - ${
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
    subject: "Someone came",
    text: sendResult,
  };

  transporter.sendMail(mailOptions);

  res.sendStatus(200);
}

module.exports = sendMail;
