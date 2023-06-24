import {
  Body,
  Controller,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  ValidationPipe,
  Req,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { User } from './User';
import { UsersService } from './users.service';
import {
  CreateUserRequest,
  UpdateProfileRequest,
  UpdateUserRequest,
  UpdatePasswordRequest,
} from './dto/users.request';
import {
  AuthenticationRequired,
  HasRole,
} from '../authentication/authentication.decorator';
import { Role } from '../authentication/authentication.enum';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}



  @Get('me')
  @AuthenticationRequired()
  getMe(@Headers() headers: any) {
    const access_token = headers.authorization.split(' ')[1];

    try {
      return this.usersService.getMe(access_token);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }



  @Patch('/updateemail')
  @AuthenticationRequired()
  updateProfile(
    @Req() req: Request,
    @Body(ValidationPipe) updateProfileRequest: UpdateProfileRequest,
    @Headers() headers: any,
  ) {
    const access_token = headers.authorization.split(' ')[1];

    return this.usersService.updateProfile(access_token, updateProfileRequest);
  }



  @Patch('/updatepassword')
  @AuthenticationRequired()
  updatePassword(
    @Req() req: Request,
    @Body(ValidationPipe) updatePasswordRequest: UpdatePasswordRequest,
    @Headers() headers: any,
  ) {
    const access_token = headers.authorization.split(' ')[1];

    return this.usersService.updatePassword(
      access_token,
      updatePasswordRequest,
    );
  }



  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body(ValidationPipe) createUserRequest: CreateUserRequest,
  ): Promise<User> {
    return await this.usersService.createUser(createUserRequest);
  }



  @AuthenticationRequired()
  @HasRole(Role.ADMINISTRATOR)
  @Get()
  @HttpCode(HttpStatus.OK)
  public getUsers() {
    return this.usersService.getUsers();
  }



  @Get(':uuid/listes')
  @HttpCode(HttpStatus.OK)
  async findUserListes(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<User> {
    return this.usersService.findUserListes(uuid);
  }



  @Get(':uuid')
  @AuthenticationRequired()
  @HttpCode(HttpStatus.OK)
  async findById(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<User> {
    return this.usersService.getUserById(uuid);
  }



  @Patch(':uuid')
  @AuthenticationRequired()
  @HasRole(Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body(ValidationPipe) updateUserRequest: UpdateUserRequest,
  ): Promise<any> {
    return await this.usersService.update(uuid, updateUserRequest);
  }
  


  @Delete(':uuid')
  @AuthenticationRequired()
  @HasRole(Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<void> {
    return await this.usersService.delete(uuid);
  }
}
