import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Liste } from './Liste';
  import { Repository } from 'typeorm';
  import {
    CreateListeRequest,
    UpdateListeRequest,
  } from './dto/listes.request';
import { User } from '../users/User';
  
  @Injectable()
  export class listesService {
    constructor(
      @InjectRepository(Liste)
      private readonly ListesRepository: Repository<Liste>,
      @InjectRepository(User)
      private readonly usersRepository: Repository<User>
    ) {}
  


    async createListe(
      createListeRequest: CreateListeRequest,
    ): Promise<any> {
      try {
        return await this.ListesRepository.save(createListeRequest);
      } catch (err) {
        throw new InternalServerErrorException(err.driverError.message);
      }
    }
  


    async getListes(): Promise<Liste[]> {
      const Listes = await this.ListesRepository.find({
        relations: {
          user: true,
        },
      });
      return Listes;
    }
  


    async getListeById(uuid: string): Promise<Liste> {
      const Liste = await this.ListesRepository.findOneBy({ id: uuid });
      if (!Liste) {
        throw new NotFoundException('Liste not found');
      }
  
      return Liste;
    }

  

    async update(
      uuid: string,
      updateListeRequest: UpdateListeRequest,
    ): Promise<any> {
      try {
        if (updateListeRequest.title) {
          throw new BadRequestException(
            'Password cannot be updated using this endpoint',
          );
        }
        const Liste = await this.ListesRepository.findOneBy({
          id: uuid,
        });
        if (!Liste) {
          throw new NotFoundException('Liste not found for update');
        }
        return await this.ListesRepository.update(
          uuid,
          updateListeRequest,
        );
      } catch (err) {
        throw new BadRequestException(err.message);
      }
    }
  


    async delete(uuid: string): Promise<any> {
      const Liste = await this.ListesRepository.findOneBy({ id: uuid });
      if (!Liste) {
        throw new NotFoundException('Liste not found for deletion');
      }
  
      await this.ListesRepository.remove(Liste);
    }
  


    public async seed() {

      const user = await this.usersRepository.findOneBy({ email: 'user@user.com' });
      const user2 = await this.usersRepository.findOneBy({ email: 'user2@user2.com' });


      const Listes1 = this.ListesRepository.create({
        title: 'Liste de courses',
        description: 'Liste de courses',
        user: user,
      });
      await this.ListesRepository.save(Listes1);
  
      
      
      const Listes2 = this.ListesRepository.create({
        title: 'Liste de tâches',
        description: 'Liste de tâches',
        user: user2,
      });
      await this.ListesRepository.save(Listes2);
    }
  }
  