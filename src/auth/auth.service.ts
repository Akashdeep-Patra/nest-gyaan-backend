import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/modules/common/enums/user-roles.enum';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (user && user.isActive) {
      const isMatch = await bcrypt.compare(pass, user.password);
      return isMatch ? user : null;
    }
    return null;
  }

  async getUser(authUser: User) {
    const user = await this.usersService.findOne(authUser.id);
    return new UserResponseDto(user);
  }

  async login(authUser: User) {
    const user = await this.usersService.findOne(authUser.id);
    let isAdmin = false;
    let canManageContent = false;
    if (user.roles) {
      isAdmin = user.roles.some((role) => role.name == UserRole.COMPANY_ADMIN);
      canManageContent = user.roles.some(
        (role) => role.name == UserRole.CONTENT_ADMIN,
      );
    }
    const payload = {
      username: user.email,
      sub: user.id,
      role: user.roles[0], // adding first role
      roles: user.roles,
      companyId: user?.company?.id,
      company: user?.company,
      permissions: { isAdmin, canManageContent },
    };

    const userResponse = new UserResponseDto(user);
    return {
      accessToken: this.jwtService.sign(payload),
      // user: { username: user.email, id: user.id, role: user.role.id, firstName: user.firstName, lastName: user.lastName }
      user: userResponse,
    };
  }
}
