import * as nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

// export const transporter = nodemailer.createTransport({
//   host: 'smtpout.secureserver.net', // Servidor SMTP de Microsoft 365
//   port: 465, // Puerto para STARTTLS
//   secure: true, // false para port 587
//   auth: {
//     user: 'ventas@lachoco-latera.com', // tu correo de GoDaddy con Microsoft 365
//     pass: 'Nu3str0d0mini0enbendicion', // tu contraseña de GoDaddy con Microsoft 365
//   },
// });
export const transporter = nodemailer.createTransport({
  //@ts-ignore
  host: process.env.MAIL_HOST, // Servidor SMTP de Microsoft 365
  port: process.env.MAIL_PORT, // Puerto para STARTTLS
  secure: false, // false para port 587
  auth: {
    user: process.env.SMTP_USERNAME, // tu correo de GoDaddy con Microsoft 365
    pass: process.env.SMTP_PASSWORD, // tu contraseña de GoDaddy con Microsoft 365
  },
});
