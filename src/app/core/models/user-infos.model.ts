export interface UserInfos {
  id_user: number;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  password?: string;
  access_token: string;
  refresh_token: string;
  picture?: string;
}
