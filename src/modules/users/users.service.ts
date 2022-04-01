import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from 'src/auth/constants';
import { ChannelRepository } from '../channel/channel.repository';
import { Role } from '../common/entities/role.entity';
import { EntityType } from '../common/enums/entity-type.enums';
import { UserRole } from '../common/enums/user-roles.enum';
import { RoleRepository } from '../common/repositories/role.repository';
import { Utilities } from '../common/utils/utilities';
import { CompanyRepository } from '../company/company.repository';
import { ChannelAdminResponseDto } from './dto/channelAdmin-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ManagerResponseDto } from './dto/manager-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private companyRepository: CompanyRepository,
    private channelRepository: ChannelRepository,
  ) {}

  async create(
    companyId: string,
    createUserDto: CreateUserDto,
    currentUser: User,
  ) {
    // check current user permissions,
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new BadRequestException('The company does not exist.');
    }

    // check if the current user has valid permissions
    this.validateCurrentUser(currentUser, companyId);

    // check if the user with same email is registered already or not
    const userWithEmail = await this.findByEmail(createUserDto.email);
    if (userWithEmail) {
      throw new BadRequestException('The user already exist.');
    }

    // check if the manager id is valid
    let manager = null;
    if (createUserDto.managerId != 'self') {
      manager = await this.findOne(createUserDto.managerId);
      if (!manager) {
        throw new BadRequestException('Selected Manager is not valid user.');
      }
    }

    let user: User = new User(createUserDto);
    if (manager) {
      user.manager = manager;
    }

    const userRoles: Role[] = [];

    if (currentUser.company) {
      user.company = currentUser.company;
    } else {
      user.company = company;
    }

    // assign user role
    if (createUserDto.permissions?.isAdmin) {
      const admin = await this.roleRepository.findByName(
        UserRole.COMPANY_ADMIN,
      );
      userRoles.push(admin);
    }
    if (
      createUserDto.permissions?.isAdmin ||
      createUserDto.permissions.canManageContent
    ) {
      userRoles.push(
        await this.roleRepository.findByName(UserRole.CONTENT_ADMIN),
      );
    }

    // assign default user role if user do not have admin permissions
    if (
      !(
        createUserDto.permissions ||
        createUserDto.permissions?.isAdmin ||
        createUserDto.permissions?.canManageContent
      )
    ) {
      const userRole = await this.roleRepository.findByName(UserRole.USER);
      userRoles.push(userRole);
    }

    user.roles = userRoles;
    user = Utilities.addAuditFields(currentUser.id, user, false);

    // set temporary Ghost password
    const salt = await bcrypt.genSalt(jwtConstants.saltRounds);
    const hash = await bcrypt.hash(jwtConstants.ghostPassword, salt);
    user.password = hash;
    //get the default channel if not specified
    const firstFollowingChannel = createUserDto.defaultChannelId
      ? await this.channelRepository.findOneById(createUserDto.defaultChannelId)
      : await this.channelRepository.findDefaultChannelForCompany(company);
    user.followingChannels = [firstFollowingChannel];

    try {
      const createdUser = await this.userRepository.addUser(user);
      return new UserResponseDto(createdUser);
    } catch (err) {
      Logger.error('Error while creating user', err);
      throw new BadRequestException('Something went wrong.');
    }
  }

  async findAll(
    companyId: string,
    type: EntityType,
    skip: number,
    limit: number,
    search: string,
    currentUser: User,
  ) {
    // check if the current user has valid permissions
    this.validateCurrentUser(currentUser, companyId);

    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new BadRequestException('The company does not exists.');
    }

    const [users, count] = await this.userRepository.findAllByCompany(
      companyId,
      type,
      skip,
      limit,
      search,
    );
    const usersDto = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      usersDto.push(new UserResponseDto(user));
    }

    return { users: usersDto, count };
  }

  async findManagers(companyId: string, currentUser: User) {
    this.validateCurrentUser(currentUser, companyId, false);

    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      throw new BadRequestException('The company does not exists.');
    }

    const users = await this.userRepository.findManagersForCompany(company);
    const managers = users.map((user) => new ManagerResponseDto(user));
    return managers;
  }

  async findChannelAdmins(currentUser: User) {
    const users = await this.userRepository.getChannelAdmins(
      currentUser.company,
    );
    const managers = users.map((user) => new ChannelAdminResponseDto(user));
    return managers;
  }

  findOne(id: string) {
    return this.userRepository.findOneById(id);
  }

  async getLoggedInUser(id: string) {
    return new UserResponseDto(await this.userRepository.findOneById(id));
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUser: User) {
    // check if the user is registered already or not
    let user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException('The user does not exist.');
    }

    // check if the current user has valid permissions
    this.validateCurrentUser(currentUser, user.company.id);

    if (updateUserDto.permissions && id == currentUser.id) {
      throw new BadRequestException('Can not update self permissions.');
    }

    // check if the manager id is valid
    let manager = null;
    if (updateUserDto.managerId && updateUserDto.managerId != 'self') {
      manager = await this.findOne(updateUserDto.managerId);
      if (!manager) {
        throw new BadRequestException('Selected Manager is not valid user.');
      }
    }

    // set user details
    const updateUser: User = new User(updateUserDto);
    user = Utilities.addAuditFields(currentUser.id, user, true);

    if (manager) {
      user.manager = manager;
    }

    // assign user role
    const userRoles: Role[] = [];
    if (updateUserDto.permissions) {
      if (updateUserDto.permissions.isAdmin) {
        const admin = await this.roleRepository.findByName(
          UserRole.COMPANY_ADMIN,
        );
        userRoles.push(admin);
      }
      if (
        updateUserDto.permissions.isAdmin ||
        updateUserDto.permissions?.canManageContent
      ) {
        userRoles.push(
          await this.roleRepository.findByName(UserRole.CONTENT_ADMIN),
        );
      }

      // assign default user role if user do not have admin permissions
      if (
        !(
          updateUserDto.permissions?.isAdmin ||
          updateUserDto.permissions?.canManageContent
        )
      ) {
        const userRole = await this.roleRepository.findByName(UserRole.USER);
        userRoles.push(userRole);
      }
    }

    user.roles = userRoles;
    try {
      const updatedUser: User = { ...user, ...updateUser };

      await this.userRepository.updateUser(updatedUser);
      return new UserResponseDto(updatedUser);
    } catch (err) {
      Logger.error('Error while updating user', err);
      throw new BadRequestException('Something went wrong.');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // Utilities
  validateCurrentUser(
    currentUser: User,
    companyId: string = null,
    checkPermissions = true,
  ) {
    if (!Utilities.isSuperAdmin(currentUser.roles)) {
      if (
        checkPermissions &&
        !currentUser?.roles?.some((role) => role.name == UserRole.COMPANY_ADMIN)
      ) {
        throw new BadRequestException(
          'You do not have permissions to perform this action.',
        );
      }

      if (companyId && currentUser?.company?.id != companyId) {
        throw new BadRequestException('Invalid request.');
      }
    }

    return true;
  }
}
