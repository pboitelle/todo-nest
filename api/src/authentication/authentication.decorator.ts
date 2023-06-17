import { SetMetadata, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from './authentication.guard';
import { Role } from './authentication.enum';

export const AuthenticationRequired = () => UseGuards(AuthenticationGuard);

export const HasRole = (role: Role) => SetMetadata('role', role);
