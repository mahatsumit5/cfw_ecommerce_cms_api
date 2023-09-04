import nodemailer from "nodemailer";
// smtp configurations

export const accountVerificationEmail = async (user, link) => {
  const { email, fName, lName } = user;
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
<br /><br />
<br /><br />
<p>
    Regareds, <br />
    CFW Store <br />
    Customer Support Team
</p>`,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

export const sendOTPNotification = async (user, otp) => {
  const { email, fName, lName } = user;
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
    subject: "OTP  ✔", // Subject line
    text: "Hello ?" + fName + "Here is your one-time-password",
    html: `
    <p>
    Hello ${fName}.${lName}
</p>
<p>
This is your one-time-password
</p>
<br />
<p>
  ${otp}
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
export const sendPassWordChangedAlert = async (user) => {
  const { email, fName, lName } = user;
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
    subject: "Password Change Confirmation", // Subject line
    text:
      "Dear " +
      { fName } +
      { lName } +
      fName +
      `Your password has been Changed`,
    html: `
    <p>
    Dear  ${fName}.${lName}
</p>
<p>
This is to confirm that the password for
 your account has been successfully changed.
  Your account is now secured with the new password that you have set.
  <br/>
If you did not change your password, 
please contact us immediately to report any 
unauthorized access to your account.
<br/>
If you have any issues or concerns regarding your account, 
please do not hesitate to contact our customer support team 
for further assistance.
<br/ 

Thank you for using our service.

 </p>
<br />

<br />

<p>
    Regareds, <br />
    ACFW Store <br />
    Customer Support Team
</p>`,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};
export const sendUserUpdateAlert = async (user) => {
  const { email, fName, lName } = user;
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
    subject: "Profile Change Alert", // Subject line
    text:
      "Dear " +
      { fName } +
      { lName } +
      fName +
      `Your profile information has been changed recently`,
    html: `
    <p>
    Dear  ${fName}.${lName}
</p>
<p>
This is to confirm that your profile 
has been successfully changed.

<br/>
If you did not change your profile, 
please contact us immediately to report any 
unauthorized access to your account.
<br/>
If you have any issues or concerns regarding your account, 
please do not hesitate to contact our customer support team 
for further assistance.
<br/ 

Thank you for using our service.

 </p>
<br />

<br />

<p>
    Regareds, <br />
    ACFW Store <br />
    Customer Support Team
</p>`,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};
