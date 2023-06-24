import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/User';
import { UsersService } from '../users/users.service';

import { Liste } from './Liste';
import { listesService } from './listes.service';
import { ListesController } from './listes.controller';

import { Task } from '../tasks/Task';
import { tasksService } from '../tasks/tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Liste, User, Task])],
  controllers: [ListesController],
  providers: [listesService, UsersService, tasksService],
  exports: [listesService],
})
export class ListesModule {}
