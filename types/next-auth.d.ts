declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username?: string;
      is_admin: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    username?: string;
    is_admin: boolean;
  }
}
