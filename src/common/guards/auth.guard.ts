
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { InvalidTokenError, TokenNotFoundError } from "../exceptions/auth-guard.exceptions.js";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const accessToken = this.extractTokenFromHeader(request) 

        if(!accessToken){
            throw new TokenNotFoundError({
                success: false,
                message: "no bearer token was passed",
                details: {}
            })
        }

        try {
            let isValid = await this.jwtService.verifyAsync(accessToken)
            request['userId'] = isValid.userId
            
        } catch (error) {
            throw new InvalidTokenError({
                success: false,
                message: "invalid token passed",
                details: error
            })
        }

        return true
    }

    private extractTokenFromHeader(request: Request){
        let [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}