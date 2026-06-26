import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type AppRole = 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';

export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
