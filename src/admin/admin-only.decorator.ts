import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';

export const AdminOnly = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user?.role !== 'ADMIN') {
        throw new ForbiddenException('Solo administradores pueden acceder a este recurso');
    }
    return request.user;
});
