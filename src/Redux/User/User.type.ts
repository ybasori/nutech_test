export interface IUser {
  name: string | null;
  token: string | null;
  loading: boolean;
  error: unknown;
  isLogin: unknown;
}
