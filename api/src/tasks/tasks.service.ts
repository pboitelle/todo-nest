import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Task } from './Task';
  import { Repository } from 'typeorm';
  import {
    CreateTaskRequest,
    UpdateTaskRequest,
    UpdateStatutRequest
  } from './dto/tasks.request';
import { Liste } from '../listes/Liste';
  
  @Injectable()
  export class tasksService {
    constructor(
      @InjectRepository(Task)
      private readonly tasksRepository: Repository<Task>,
      @InjectRepository(Liste)
      private readonly listesRepository: Repository<Liste>
    ) {}
  


    async createTask(
      createTaskRequest: CreateTaskRequest,
    ): Promise<any> {
      try {
        return await this.tasksRepository.save(createTaskRequest);
      } catch (err) {
        throw new InternalServerErrorException(err.driverError.message);
      }
    }
  


    async getTasks(): Promise<Task[]> {
      const Tasks = await this.tasksRepository.find({
        relations: {
          liste: true
        },
      });
      return Tasks;
    }
  


    async getTaskById(uuid: string): Promise<Task> {
      const Task = await this.tasksRepository.findOneBy({ id: uuid });
      if (!Task) {
        throw new NotFoundException('Task not found');
      }
  
      return Task;
    }



    // Permet de modifier l'etat du type de la tache
    async updateStatutTask(
      updateStatutRequest: UpdateStatutRequest,
      taskId: string,
    ): Promise<any> {

      await this.tasksRepository.update(taskId, {
        statut: updateStatutRequest.statut,
      });

      return { message: 'Task updated successfully' };
    }

  

    async update(
      uuid: string,
      updateTaskRequest: UpdateTaskRequest,
    ): Promise<any> {
      try {
        if (updateTaskRequest.title) {
          throw new BadRequestException(
            'Password cannot be updated using this endpoint',
          );
        }
        const Task = await this.tasksRepository.findOneBy({
          id: uuid,
        });
        if (!Task) {
          throw new NotFoundException('Task not found for update');
        }
        return await this.tasksRepository.update(
          uuid,
          updateTaskRequest,
        );
      } catch (err) {
        throw new BadRequestException(err.message);
      }
    }
  


    async delete(uuid: string): Promise<any> {
      const Task = await this.tasksRepository.findOneBy({ id: uuid });
      if (!Task) {
        throw new NotFoundException('Task not found for deletion');
      }
  
      await this.tasksRepository.remove(Task);
    }
  


    public async seed() {

      await this.tasksRepository.delete({});

      const Listes1 = await this.listesRepository.findOneBy({title: 'Liste de courses'});
      const Listes2 = await this.listesRepository.findOneBy({title: 'Liste de tâches'});


      const Tasks1 = this.tasksRepository.create({
        title: 'Lait',
        liste: Listes1,
      });
      await this.tasksRepository.save(Tasks1);
      const Tasks2 = this.tasksRepository.create({
        title: 'Oeufs',
        liste: Listes1,
      });
      await this.tasksRepository.save(Tasks2);
      const Tasks3 = this.tasksRepository.create({
        title: 'Brosse à dents',
        liste: Listes1,
      });
      await this.tasksRepository.save(Tasks3);
  
      
      
      const Tasks4 = this.tasksRepository.create({
        title: 'Faire la vaisselle',
        liste: Listes2,
      });
      await this.tasksRepository.save(Tasks4);
      const Tasks5 = this.tasksRepository.create({
        title: 'Faire le ménage',
        liste: Listes2,
      });
      await this.tasksRepository.save(Tasks5);
    }
  }
  