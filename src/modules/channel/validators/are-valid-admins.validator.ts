import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Utilities } from 'src/modules/common/utils/utilities';
import { UserRepository } from 'src/modules/users/user.repository';

@ValidatorConstraint({ name: 'AreAdminsValid', async: true })
@Injectable()
export class AreAdminsValid implements ValidatorConstraintInterface {
  constructor(private readonly usersRepository: UserRepository) {}

  async validate(admins: string[]) {
    if (!admins) return true;
    admins.forEach(async (userId) => {
      const user = await this.usersRepository.findOneById(userId);
      if (!Utilities.canBeChannelAdmin(user)) return false;
    });
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return `The admins provided are not valid.`;
  }
}
