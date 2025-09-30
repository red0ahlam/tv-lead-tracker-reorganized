import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter
    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: this.configService.get('ETHEREAL_EMAIL'),
                pass: this.configService.get('ETHEREAL_PASSWORD'),
            },
        })
    }

    async sendPasswordResetEmail(toEmail: string, token: string) {
        const resetLink = `http://example.com/resetPassword?token=${token}`
        const mailOptions = {
            from: 'Auth-backend service',
            to: toEmail,
            subject: "password reset request",
            html: `<p>you requested a password reset. click the link below to reset your password:<\p>
            <a href="${resetLink}">reset password<\a>`
        }
        await this.transporter.sendMail(mailOptions)
    }
}
