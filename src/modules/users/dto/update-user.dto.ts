import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  user_name: string;
  first_name: string;
  last_name: string;
  birth_day: string;
  avatar: string;
  phone: string;
  address: string;
}
