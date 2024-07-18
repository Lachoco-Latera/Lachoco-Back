import * as nodemailer from 'nodemailer';
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
  host: 'smtp-mail.outlook.com', // Servidor SMTP de Microsoft 365
  port: 587, // Puerto para STARTTLS
  secure: false, // false para port 587
  auth: {
    user: 'ventas_lachoco_latera@hotmail.com', // tu correo de GoDaddy con Microsoft 365
    pass: 'Nu3str0d0mini0enbendicion', // tu contraseña de GoDaddy con Microsoft 365
  },
});
