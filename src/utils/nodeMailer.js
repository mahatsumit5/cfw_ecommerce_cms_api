import nodemailer from "nodemailer";
// smtp configurations

export const accountVerificationEmail = async (obj, link) => {
  const { email, fName } = obj;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `CFW <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: "VERIFICATION REQUIRED ✔", // Subject line
    text: "Hello ?" + fName + "follow the link to activate your account" + link,
    html: `
    <h1>Hello ${fName}</h1>
    <p>Verify your email address</p>
    <a>${link}</a>`,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

// tempelate

// use send methods
