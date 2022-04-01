import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/modules/common/enums/user-roles.enum';
import { User } from 'src/modules/users/entities/user.entity';

export const GetUser = createParamDecorator(
  (
    options: { mustHaveRoles: UserRole[] } = {
      mustHaveRoles: [],
    },
    ctx: ExecutionContext,
  ): User => {
    const { mustHaveRoles } = options;
    const req = ctx.switchToHttp().getRequest();
    const user: User = req.user;
    if (
      mustHaveRoles?.length &&
      !mustHaveRoles.every((role) =>
        user.roles.find((userRole) => userRole.name === role),
      )
    ) {
      throw new UnauthorizedException(
        `The user doesn't have the proper authorizations `,
      );
    }
    return user;
  },
);
