import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PasswordService } from './services/password/password.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '../common/services/common.module.js';
import { MailerService } from './services/mailer/mailer.service.js';

@Module({
  imports: [JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>("JWT_SECRET")
    }),
    inject: [ConfigService]
  }),
    CommonModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, MailerService]
})
export class AuthModule { }
