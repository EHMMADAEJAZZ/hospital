// import sgMail from '@sendgrid/mail';
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: 'rifatara2450@gmail.com', // Change to your recipient
//   from: 'ehmmadaejazz33@gmail.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent');
//   })
//   .catch((error) => {
//     console.error(error);
//   });
import nodemailer from 'nodemailer';
// import nodemailerSendgrid from 'nodemailer-sendgrid';

const sendEmail = async (email, subject, template) => {
  const tranpoter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    service: 'gmail',
    auth: {
      user: 'ehmmadaejazz33@gmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: 'ehmmadaejazz33@gmail.com',
    to: email,
    subject,
    // text: 'Please click the link below to reset your password',
    html: template,
  };
  await tranpoter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err.message);
    else console.log('Email sent');
  });
};

export default sendEmail;
