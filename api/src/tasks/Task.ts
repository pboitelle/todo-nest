import { IsString } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Liste } from '../listes/Liste';
import { Statut } from './tasks.enum';


@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsString()
    title: string;

    @Column({
        nullable: false,
        type: 'enum',
        enum: Statut,
        default: Statut.EN_ATTENTE,
    })
    public statut: Statut;

    @ManyToOne(() => Liste, {nullable: true} )
    liste: Liste;
}
