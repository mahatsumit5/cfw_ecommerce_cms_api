"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUserUpdateAlert = exports.sendPassWordChangedAlert = exports.sendOTPNotification = exports.accountVerifiedEmail = exports.accountVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const accountVerificationEmail = (user, link) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fName, lName } = user;
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST || "",
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const info = yield transporter.sendMail({
        from: `CFW <${process.env.SMTP_USER}>`,
        to: email,
        subject: "VERIFICATION REQUIRED ✔",
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
});
exports.accountVerificationEmail = accountVerificationEmail;
const accountVerifiedEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fName, lName } = user;
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const info = yield transporter.sendMail({
        from: `CFW <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Verification Successfull✔",
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
});
exports.accountVerifiedEmail = accountVerifiedEmail;
const sendOTPNotification = (user, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fName, lName } = user;
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const info = yield transporter.sendMail({
        from: `CFW <${process.env.SMTP_USER}>`,
        to: email,
        subject: "OTP  ✔",
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
});
exports.sendOTPNotification = sendOTPNotification;
const sendPassWordChangedAlert = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fName, lName } = user;
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const info = yield transporter.sendMail({
        from: `CFW <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Password Change Confirmation",
        text: "Dear " +
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
});
exports.sendPassWordChangedAlert = sendPassWordChangedAlert;
const sendUserUpdateAlert = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fName, lName } = user;
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const info = yield transporter.sendMail({
        from: `CFW <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Profile Change Alert",
        text: "Dear " +
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
});
exports.sendUserUpdateAlert = sendUserUpdateAlert;
