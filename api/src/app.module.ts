import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmCustomModule } from './typeorm/typeorm.module';

import { UsersModule } from './users/users.module';
import { User } from './users/User';

import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { SeedService } from './seed/seed.service';
import { ListesModule } from './listes/listes.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
      }),
      envFilePath: './.env',
    }),
    TypeOrmCustomModule.register(),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    ListesModule,
    TasksModule,
    AuthenticationModule
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, SeedService],
  exports: [SeedService],
})
export class AppModule {}
