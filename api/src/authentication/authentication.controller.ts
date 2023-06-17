import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { LoginRequest, RegisterRequest } from './dto/authentication.request';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  public constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body(ValidationPipe) loginRequest: LoginRequest) {
    const response = await this.authenticationService.login(loginRequest);

    return {
      id: response.payload.id,
      email: response.payload.email,
      role: response.payload.role,
      access_token: response.access_token,
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public register(@Body(ValidationPipe) registerRequest: RegisterRequest) {
    return this.authenticationService.register(registerRequest);
  }
}
