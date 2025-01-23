export class RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDay: string;
  phone: string;
  address: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class TUserTokens {
  user_id: number;
  email: string;
}

export class TUser {
  user_id: number;
  email: string;
  user_name: string;
  full_name: string;
  birth_day: string;
  avatar: string;
  phone: string;
  address: string;
  role_id: number;
}

export class TResRefreshToken {
  user_id: number;
  email: string;
  acT: string;
}

export class TResLogin {
  user_id: number;
  email: string;
  user_name: string;
  full_name: string;
  birth_day: string;
  avatar: string;
  phone: string;
  address: string;
  role_id: number;
  acT: string;
}
