export type JwtPayload = {
  sub: string;
  email: string;
  role: 'CLIENT' | 'PROFESSIONAL';
};
