import nodemailer from "nodemailer";
// smtp configurations

export const accountVerificationEmail = async (user) => {
  const { email, fName, lName } = user;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
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
    <p>
    Hello ${fName}.${lName}
</p>
<p>
please follow the link below to activate your account.
</p>
<br />
<br />
<p>
   <a href=${link}>  ${link} </a>
</p>
<br />
<br />

<p>
    Regareds, <br />
    EST Store <br />
    Customer Support Team
</p>`,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};
export const accountVerifiedEmail = async (user) => {
  const { email, fName, lName } = user;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `CFW <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: "Verification Successfull✔", // Subject line
    text: "Hello ?" + fName + "Your acccoun has been Verified.",
    html: `
    <p>
    Hello ${fName}.${lName}
</p>
<p>
Your accoun has been verified.
please follow the link below to login into your account.
</p>
<a href= ${process.env.WEB_DOMAIN}>Sign In</a>
<br />
<br />

<br />
<br />

<p>
    Regareds, <br />
    CFW Store <br />
    Customer Support Team
</p>`,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};
