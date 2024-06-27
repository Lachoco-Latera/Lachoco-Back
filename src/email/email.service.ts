import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendPostulation(datamailer) {
    await this._processSendEmail(
      datamailer.to,
      datamailer.subject,
      datamailer.text,
      datamailer.template,
    );
  }

  async _processSendEmail(to, subject, text, body): Promise<void> {
    await this.mailerService
      .sendMail({
        to: to,
        subject: subject,
        text: text,
        html: body,
      })
      .then(() => {
        console.log('Email sent');
      })
      .catch((e) => {
        console.log('Error sending email', e);
      });
  }
}
