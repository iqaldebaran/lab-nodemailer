const nodemailer = require('nodemailer');
const hbs = require("hbs");
const fs = require("fs");
const User = require("../models/User");


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})


const generateHtml = (filename, options = {}) => {
  const html = hbs.compile(fs.readFileSync((__dirname, `./views/${filename}.hbs`), "utf8"))
  return html(options); //Options pasa la vista
};

exports.send = (options) => {
  const html = generateHtml(options.filename, options)
  const mailOptions = {
    from: "<noreply@adolfovela.com>",
    to: options.email,
    subject: "Verificacion del correo",
    text: options.username, //`Código de confirmación ${User.confirmationCode}`,
    html 
  }
  return transporter.sendMail(mailOptions) //Manda el correo
};