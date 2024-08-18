export interface AuthContextProps {
  user: any;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
export type initialStateProps = {
  user: any;
  loading: boolean;
  error: string | null;
};
export type actionProps = {
  type: string;
  payload: any;
};
