const nodemailer = require("nodemailer");

// Gmail app-password creds from env. When not configured the send is skipped
// silently — the OTP is still logged to the server console for development.
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
}

async function sendMail(to, subject, text) {
  if (!transporter) return;
  await transporter.sendMail({
    from: `JusGo <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}

module.exports = { sendMail };
