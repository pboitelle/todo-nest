import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/User';
import { UsersService } from '../users/users.service';

import { Task } from './Task';
import { tasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

import { Liste } from '../listes/Liste';
import { listesService } from '../listes/listes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Liste])],
  controllers: [TasksController],
  providers: [tasksService, UsersService, listesService],
  exports: [tasksService],
})
export class TasksModule {}
