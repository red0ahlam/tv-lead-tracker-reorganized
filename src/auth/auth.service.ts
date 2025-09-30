import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ChangePasswordDTO, LogInDTO, LogOutDTO, ResetPasswordDTO, SignUpDTO, UpdateAccessTokenDTO } from './dto/auth.dto.js';
import { PasswordService } from './services/password/password.service.js';
import { EmailAlreadyExistsError, EmailDoesNotExistError, InvalidCredentialsError, InvalidUserError } from './exceptions/auth.exceptions.js';
import { ExpiredTokenError, InvalidTokenError } from '../common/exceptions/auth-guard.exceptions.js';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from './services/mailer/mailer.service.js';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private passwordService: PasswordService,
        private jwtService: JwtService,
        private mailerService: MailerService
    ) { }

    async signUp(input: SignUpDTO) {
        let existingUser = await this.prisma.user.findUnique({
            where: {
                email: input.email
            }
        })

        if (existingUser) {
            throw new EmailAlreadyExistsError({
                success: false,
                message: "email already taken, choose another",
                details: {}
            })
        }

        let userId = uuidv4()
        let hashPassword = await this.passwordService.hashPassword(input.password)
        let accessToken = await this.generateAccessToken(userId)
        let { refreshToken, expiresIn } = await this.generateRefreshToken()

        await this.prisma.user.create({
            data: {
                id: userId,
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email,
                password: hashPassword,
                accessToken: accessToken,
                refreshToken: refreshToken,
                refreshTokenExp: expiresIn
            }
        })

        return { 
            accessToken, 
            refreshToken 
        }
    }

    async logIn(input: LogInDTO) {
        let existingUser = await this.prisma.user.findUnique({
            where: {
                email: input.email
            },
            select: { id: true, email: true, password: true },
        })

        const isValid = existingUser && (await this.passwordService.comparePassword(input.password, existingUser.password))
        if (!isValid) {
            throw new InvalidCredentialsError({
                success: false,
                message: "invalid email or password",
                details: {}
            })
        }

        const accessToken = await this.generateAccessToken(existingUser.id)
        const { refreshToken, expiresIn } = await this.generateRefreshToken()

        await this.prisma.user.update({
            where: {
                email: existingUser.email
            },
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                refreshTokenExp: expiresIn
            }
        })

        return {
            accessToken,
            refreshToken
        }
    }

    async logOut(userId: string){
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            throw new InvalidUserError({
                success: false,
                message: "invalid user",
                details: {}
            })
        }

        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                accessToken: null,
                refreshToken: null,
                refreshTokenExp: null
            }
        })

        return { message: "logout successful" }
    }

    async changePassword(userId: string, input: ChangePasswordDTO){
        const { oldPassword, newPassword } = input

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            throw new InvalidUserError({
                success: false,
                message: "no user found",
                details: {}
            })
        }

        const passwordMatch = await this.passwordService.comparePassword(oldPassword, user.password)
        if(!passwordMatch){
            throw new InvalidCredentialsError({
                success: false,
                message: "invalid password",
                details: {}
            })
        }

        const newPasswordHash = await this.passwordService.hashPassword(newPassword)

        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: newPasswordHash
            }
        })

        return {message: "password changed successfully"}

    }

    async forgotPassword(email: string){
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            throw new EmailDoesNotExistError({
                success: false,
                message: "no such email exists",
                details: {}
            })
        }

        const resetToken = uuidv4()
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getUTCHours() + 1)

        await this.prisma.user.update({
            where: {
                email
            }, 
            data: {
                resetToken: resetToken,
                resetTokenExp: expiryDate 
            }
        })
        await this.mailerService.sendPasswordResetEmail(email, resetToken)
        return { message: "if this user exists, they will recieve an email" }
    }

    async resetPassword(input: ResetPasswordDTO){
        const { newPassword, resetToken } = input
        const user = await this.prisma.user.findUnique({
            where: {
                resetToken: resetToken
            }
        })

        if(!user){
            throw new InvalidTokenError({
                success: false,
                message: "invalid token",
                details: {}
            })
        }

        let isExpired = new Date().getTime() > new Date(user.resetTokenExp!).getTime()
        if(isExpired){
            throw new InvalidTokenError({
                success: false,
                message: "token expired",
                details: {}
            })
        }

        let newPasswordHash = await this.passwordService.hashPassword(newPassword)

        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: newPasswordHash,
                resetToken: null,
                resetTokenExp: null
            }
        })

        return { message: "password reset successful" }
    }

    async updateAccessToken(input: UpdateAccessTokenDTO){
        const { refreshToken } = input
        const existingUser = await this.prisma.user.findUnique({
            where: {
                refreshToken
            }
        })

        if(!existingUser){
            throw new InvalidUserError({
                success: false,
                message: "invalid refresh token",
                details: {}
            })
        }

        const isExpired = new Date().getTime() > new Date(existingUser.refreshTokenExp!).getTime()
        if(isExpired){
            throw new ExpiredTokenError({
                success: false,
                message: "refresh token expired",
                details: {}
            })
        }

        const accessToken = await this.generateAccessToken(existingUser.id)

        await this.prisma.user.update({
            where: {
                email: existingUser.email
            },
            data: {
                accessToken: accessToken
            }
        })

        return {
            accessToken
        }
    }

    private async generateAccessToken(userId: string){
        return await this.jwtService.signAsync({ userId }, { expiresIn: "5m" })
    }

    private async generateRefreshToken(){
        const refreshToken = uuidv4()
        const expiresIn = new Date()
        expiresIn.setDate(expiresIn.getDate() + 10)
        return {
            refreshToken,
            expiresIn
        }
    }
}
