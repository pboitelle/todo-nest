import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './User';
import { Liste } from '../listes/Liste';
import { Task } from '../tasks/Task';
import { Repository } from 'typeorm';
import {
  CreateUserRequest,
  UpdateProfileRequest,
  UpdateUserRequest,
  UpdatePasswordRequest,
} from './dto/users.request';
import { hash } from 'bcryptjs';
import { Role } from '../authentication/authentication.enum';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Liste)
    private readonly ListesRepository: Repository<Liste>,
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly jwtService: JwtService
  ) {}



  async getMe(access_token: string): Promise<User> {
    const email = this.jwtService.verify(access_token, {
      secret: process.env.JWT_SECRET,
    }).email;

    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }



  // Permet de modifier l'email profil de l'utilisateur
  async updateProfile(
    access_token: string,
    updateProfileRequest: UpdateProfileRequest,
  ): Promise<any> {
    const user = await this.getMe(access_token);

    await this.usersRepository.update(user.id, {
      email: updateProfileRequest.email,
    });

    return { message: 'Profile updated successfully' };
  }



  // Permet de modifier le mot de passe de l'utilisateur
  async updatePassword(
    access_token: string,
    updatePasswordRequest: UpdatePasswordRequest,
  ): Promise<any> {
    const user = await this.getMe(access_token);
    const NewPassword = await hash(updatePasswordRequest.password, 10);

    await this.usersRepository.update(user.id, {
      password: NewPassword,
    });

    return { message: 'Profile updated successfully' };
  }



  // PErmet de créer un utilisateur
  async createUser(createUserRequest: CreateUserRequest): Promise<any> {
    try {
      return await this.usersRepository.save(createUserRequest);
    } catch (err) {
      throw new InternalServerErrorException(err.driverError.message);
    }
  }


  
  // Retourne tous les utilisateurs
  public getUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }



  // REtourne les listes d'un utilisateur et ses tâches
  async findUserListes(uuid: string) {
    const user = await this.usersRepository.findOne({
      where: {
        id: uuid,
      },
      relations: ['listes', 'listes.tasks'],
    });
    return user;
  }



  // Retourne l'utilisateur par son email
  public getUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }



  // Retourne l'utilisateur par son id
  async getUserById(uuid: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: uuid });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }



  // Permet de mettre à jour un utilisateur
  async update(
    uuid: string,
    updateUserRequest: UpdateUserRequest,
  ): Promise<any> {
    try {
      if (updateUserRequest.password) {
        throw new BadRequestException(
          'Password cannot be updated using this endpoint',
        );
      }
      const user = await this.usersRepository.findOneBy({ id: uuid });
      if (!user) {
        throw new NotFoundException('User not found for update');
      }
      return await this.usersRepository.update(uuid, updateUserRequest);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }



  // Permet de supprimer un utilisateur
  async delete(uuid: string): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id: uuid });
    if (!user) {
      throw new NotFoundException('User not found for deletion');
    }

    await this.usersRepository.remove(user);
  }



  // Permet de generer des utilisateurs
  public async seed() {
    const userPassword = await hash(process.env.USER_PASSWORD, 10);
    const administratorPassword = await hash(process.env.ADMIN_PASSWORD, 10);

    await this.tasksRepository.delete({});
    await this.ListesRepository.delete({});
    await this.usersRepository.delete({});


    const administrator = this.usersRepository.create({
      role: Role.ADMINISTRATOR,
      email: 'admin@admin.com',
      firstname: 'Pierre',
      lastname: 'Boitelle',
      password: administratorPassword
    });
    await this.usersRepository.save(administrator);


    const user = this.usersRepository.create({
      role: Role.USER,
      email: 'user@user.com',
      firstname: 'Victor',
      lastname: 'Valee',
      password: userPassword
    });
    await this.usersRepository.save(user);


    const user2 = this.usersRepository.create({
      role: Role.USER,
      email: 'user2@user2.com',
      firstname: 'Ulysse',
      lastname: 'MF',
      password: userPassword
    });
    await this.usersRepository.save(user2);
  }
}
