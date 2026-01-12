import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendResolvedEmail(toEmail, itemName) {
  try {
    const info = await transporter.sendMail({
      from: `"Lost & Found Portal" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Your Lost/Found Report Has Been Resolved",
      html: `
        <h2>Hello,</h2>
        <p>Your reported item <b>${itemName}</b> has been marked as <b>Resolved</b>.</p>
        <p>Thank you for using our Lost & Found portal.</p>
      `,
    });

    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
}
