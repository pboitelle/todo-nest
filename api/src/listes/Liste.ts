import { IsString } from 'class-validator';
import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/User';

import { Task } from '../tasks/Task';


@Entity()
export class Liste {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsString()
    title: string;

    @Column({type: 'text'})
    @IsString()
    description: string;

    @ManyToOne(() => User, {nullable: true} )
    user: User;

    @OneToMany(() => Task, (Task) => Task.liste)
    tasks: Task[];
}
