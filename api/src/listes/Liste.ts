import { IsDate, IsDecimal, IsString } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/User';


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
}
