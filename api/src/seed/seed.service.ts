import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { listesService } from '../listes/listes.service';
import { tasksService } from '../tasks/tasks.service';


@Injectable()
export class SeedService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly listesService: listesService,
    private readonly tasksService: tasksService,

  ) {}

  public async seed() { 
    await this.usersService.seed();
    await this.listesService.seed();
    await this.tasksService.seed();
  }
}
