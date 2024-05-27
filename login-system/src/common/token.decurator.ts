import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ResponseUtils } from './response.model';

export const LocalToken = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        try {
            const request = ctx.switchToHttp().getRequest();
            if(!request.headers['authorization']) {
                throw ResponseUtils.BadRequestResponse('This Request should have Token');
            }
            const token = request.headers['authorization'].split(' ')
            return token[1];
        } catch (error) {
            throw ResponseUtils.BadRequestResponse(error);
        }
    },
);