import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class ResetPasswordEmailService {
  private static chars = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '0123456789',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  ];
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'alboig2005@gmail.com',
      pass: 'gargamel12!',
    },
  });

  private getPassword(letters: number, numbers: number, either: number): string {
    return [letters, numbers, either]
      .map((len, i) => {
        return Array(len)
          .fill(ResetPasswordEmailService.chars[i])
          .map((x) => {
            return x[Math.floor(Math.random() * x.length)];
          })
          .join('');
      })
      .concat()
      .join('')
      .split('')
      .sort(() => {
        return 0.5 - Math.random();
      })
      .join('');
  }

  public async resetPassword(email: string): Promise<any> {
    return await this.transporter.sendMail({
      from: 'alboig2005@gmail.com',
      to: email,
      subject: 'Reset Password',
      text: `Dear recipient, your password has been reset. Your new password is ${this.getPassword(
        1, 1, 6
      )}`,
    });
  }
}
