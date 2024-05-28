const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Set Up Transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //   Define Email Options
  const mailOptions = {
    from: 'Admin NodeJs <admin@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Sending The Mail
  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
