import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './User';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { Liste } from '../listes/Liste';
import { listesService } from '../listes/listes.service';

import { Task } from '../tasks/Task';
import { tasksService } from '../tasks/tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Liste, Task])],
  controllers: [UsersController],
  providers: [UsersService, listesService, tasksService],
  exports: [UsersService],
})
export class UsersModule {}
