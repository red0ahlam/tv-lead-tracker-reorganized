
import { IsDefined, IsString, IsEmail, MinLength, IsNotEmpty, Matches } from "class-validator";

export class SignUpDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    lastName: string

    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/(?=.*[a-z])/, { message: 'Password must contain a lowercase letter' })
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain an uppercase letter' })
    @Matches(/(?=.*\d)/, { message: 'Password must contain a number' })
    @Matches(/(?=.*[@$!%*?&])/, { message: 'Password must contain a special character: [@$!%*?&]' })
    password: string
}

export class LogInDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    password: string
}

export class LogOutDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    accessToken: string
}

export class UpdateAccessTokenDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    refreshToken: string
}

export class ChangePasswordDTO{
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    oldPassword: string

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/(?=.*[a-z])/, { message: 'Password must contain a lowercase letter' })
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain an uppercase letter' })
    @Matches(/(?=.*\d)/, { message: 'Password must contain a number' })
    @Matches(/(?=.*[@$!%*?&])/, { message: 'Password must contain a special character: [@$!%*?&]' })
    newPassword: string
}

export class ForgotPasswordDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string
}

export class ResetPasswordDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    resetToken: string

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/(?=.*[a-z])/, { message: 'Password must contain a lowercase letter' })
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain an uppercase letter' })
    @Matches(/(?=.*\d)/, { message: 'Password must contain a number' })
    @Matches(/(?=.*[@$!%*?&])/, { message: 'Password must contain a special character: [@$!%*?&]' })
    newPassword: string
}