import { IsDateString, IsDefined, IsEnum, IsString } from 'class-validator';
import { Statut } from '../tasks.enum';

export class CreateTaskRequest {
    @IsDefined()
    @IsString()
    public title: string;
}

export class UpdateTaskRequest {
    @IsDefined()
    @IsString()
    public title: string;
}

export class UpdateStatutRequest {
    @IsDefined()
    @IsEnum(Statut)
    public statut: Statut;
}