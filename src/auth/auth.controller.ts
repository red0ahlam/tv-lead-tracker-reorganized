import { Body, Controller, Get, HttpCode, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { ChangePasswordDTO, ForgotPasswordDTO, LogInDTO, LogOutDTO, ResetPasswordDTO, SignUpDTO, UpdateAccessTokenDTO } from './dto/auth.dto.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import type { AuthorizedRequest } from './interfaces/auth.interfaces.js';
import { Roles } from '../common/decorators/role.decorator.js';
import { RoleGuard } from '../common/guards/role.guard.js';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    @Post('signup')
    async signUp(@Body() input: SignUpDTO) {
        return await this.authService.signUp(input)
    }

    @Post('login')
    @HttpCode(200)
    async logIn(@Body() input: LogInDTO) {
        return await this.authService.logIn(input)
    }

    @Post('logout')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    async logOut(@Req() req: AuthorizedRequest) {
        return await this.authService.logOut(req.userId)
    }

    @Post('updateToken')
    @HttpCode(200)
    async updateAccessToken(@Body() input: UpdateAccessTokenDTO) {
        return await this.authService.updateAccessToken(input)
    }

    @Post('changePassword')
    @UseGuards(AuthGuard)
    async changePassword(@Body() input: ChangePasswordDTO, @Req() req: AuthorizedRequest){
        return await this.authService.changePassword(req.userId, input)
    }

    @Post('forgotPassword')
    @HttpCode(200)
    async forgotPassword(@Body() input: ForgotPasswordDTO){
        return await this.authService.forgotPassword(input.email)
    }

    @Post('resetPassword')
    @HttpCode(200)
    async resetPassword(@Body() input: ResetPasswordDTO){
        return await this.authService.resetPassword(input)
    }

    @Get('profile')
    @Roles(['admin', 'user'])
    @UseGuards(AuthGuard, RoleGuard)
    async getProfile(@Req() request: AuthorizedRequest) {
        return {
            userId: request.userId
        };
    }
}
