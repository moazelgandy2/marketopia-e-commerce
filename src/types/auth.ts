export type LoginType = {
  identifier: string;
  password: string;
};

export type RegisterType = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  user_type?: UserRoleType;
  fcm_token?: string;
};

export enum UserRoleType {
  USER = "user",
  DELIVERYMAN = "deliveryman",
}

enum UserStatusType {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type UserType = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  image: string;
  user_type: UserRoleType;
  status: UserStatusType;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LoginResponseType = {
  status: boolean;
  errorNum: number | null;
  message: string;
  data: {
    user: UserType;
    token: string;
  };
};

export type SessionType = {
  user: UserType;
  token: string;
};
