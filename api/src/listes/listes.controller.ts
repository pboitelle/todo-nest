import {
    Body,
    Controller,
    Get,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    ValidationPipe,
    Req,
    BadRequestException,
  } from '@nestjs/common';
  import { Liste } from './Liste';
  import { listesService } from './listes.service';
  import {
    CreateListeRequest,
    UpdateListeRequest,
  } from './dto/listes.request';
  import {
    AuthenticationRequired,
    HasRole,
  } from '../authentication/authentication.decorator';
  import { Role } from '../authentication/authentication.enum';
  import { Request } from 'express';
  
  @Controller('listes')
  export class ListesController {
    constructor(private readonly listesService: listesService) {}
  


    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createListe(
      @Body(ValidationPipe) createListeRequest: CreateListeRequest,
    ): Promise<Liste> {
      return await this.listesService.createListe(
        createListeRequest,
      );
    }
  


    @AuthenticationRequired()
    @HasRole(Role.ADMINISTRATOR)
    @Get()
    @HttpCode(HttpStatus.OK)
    public getListes() {
      return this.listesService.getListes();
    }
  


    @Get(':uuid')
    @AuthenticationRequired()
    @HttpCode(HttpStatus.OK)
    async findById(
      @Param('uuid', ParseUUIDPipe) uuid: string,
    ): Promise<Liste> {
      return this.listesService.getListeById(uuid);
    }
  


    @Patch(':uuid')
    @AuthenticationRequired()
    @HasRole(Role.USER)
    @HttpCode(HttpStatus.OK)
    async update(
      @Param('uuid', ParseUUIDPipe) uuid: string,
      @Body(ValidationPipe) updateListeRequest: UpdateListeRequest,
    ): Promise<any> {
      return await this.listesService.update(uuid, updateListeRequest);
    }
  


    @Delete(':uuid')
    @AuthenticationRequired()
    @HasRole(Role.ADMINISTRATOR)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<void> {
      return await this.listesService.delete(uuid);
    }
  }
  