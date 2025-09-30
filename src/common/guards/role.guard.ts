
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Roles } from "../decorators/role.decorator.js";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../prisma/prisma.service.js";
import { UtilityService } from "../services/utility-service/utility.service.js";
import { PermissionDeniedError } from "../exceptions/role.guard.exceptions.js";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
        private utlityService: UtilityService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const roles = this.reflector.get(Roles, context.getHandler())

        if (roles.length == 0) {
            return true
        }

        const user = await this.prisma.user.findUnique({
            where: {
                id: request.userId
            },
            select: {
                role: true
            }
        })

        if (!user || !user.role) {
            throw new ForbiddenException('User has no roles');
        }

        const isAuthorizedRole = roles.some((role) => {
            return this.utlityService.normalizeText(user.role) === this.utlityService.normalizeText(role)
        })

        if(!isAuthorizedRole){
            throw new PermissionDeniedError({
                success: false,
                message: "unauthorized role",
                details: {}
            })
        }

        return true
    }
}