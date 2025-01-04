import nodemailer from "nodemailer";
import { AppError } from "../middlewares/AppError";

export const sendNotification = async (mailOptions: {
  [key: string]: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_EMAIL_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      throw new AppError(500, "Error sending email");
    }
    return "Email sent successfully";
  });
};
