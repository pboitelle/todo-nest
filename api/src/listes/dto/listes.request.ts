import { IsDecimal, IsDefined, IsString, IsDate, IsDateString } from 'class-validator';

export class CreateListeRequest {
    @IsDefined()
    @IsString()
    public title: string;

    @IsDefined()
    @IsString()
    public description: string;
}

export class UpdateListeRequest {
    @IsDefined()
    @IsString()
    public title: string;

    @IsDefined()
    @IsString()
    public description: string;
}