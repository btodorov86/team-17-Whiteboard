import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
@Injectable()
export class ResetPasswordEmailService {

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alboig2005@gmail.com',
        pass: 'gargamel12!'
    }
});

  public async resetPassword (email: string): Promise<any> {
    return await this.transporter.sendMail({
      from: 'alboig2005@gmail.com',
      to: email,
      subject: 'Reset Password',
      text: 'Dear recipient, your password has been reset. Your new password is 1111111'
  })
}

}