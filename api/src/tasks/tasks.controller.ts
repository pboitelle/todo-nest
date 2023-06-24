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
    NotFoundException,
    Headers,
  } from '@nestjs/common';
  import { Task } from './Task';
  import { tasksService } from './tasks.service';
  import {
    CreateTaskRequest,
    UpdateTaskRequest,
    UpdateStatutRequest
  } from './dto/tasks.request';
  import {
    AuthenticationRequired,
    HasRole,
  } from '../authentication/authentication.decorator';
  import { Role } from '../authentication/authentication.enum';
  import { Request } from 'express';
  
  @Controller('tasks')
  export class TasksController {
    constructor(private readonly tasksService: tasksService) {}
  


    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createTask(
      @Body(ValidationPipe) createTaskRequest: CreateTaskRequest,
    ): Promise<Task> {
      return await this.tasksService.createTask(
        createTaskRequest,
      );
    }
  


    @AuthenticationRequired()
    @HasRole(Role.ADMINISTRATOR)
    @Get()
    @HttpCode(HttpStatus.OK)
    public getTasks() {
      return this.tasksService.getTasks();
    }
  


    @Get(':uuid')
    @AuthenticationRequired()
    @HttpCode(HttpStatus.OK)
    async findById(
      @Param('uuid', ParseUUIDPipe) uuid: string,
    ): Promise<Task> {
      return this.tasksService.getTaskById(uuid);
    }



    @Patch(':uuid/update_statut')
    @AuthenticationRequired()
    updateProfile(
      @Req() req: Request,
      @Body(ValidationPipe) updateStatutRequest: UpdateStatutRequest,
      @Param('uuid', ParseUUIDPipe) uuid: string,
      @Headers() headers: any,
    ) {

      return this.tasksService.updateStatutTask(updateStatutRequest, uuid);
    }
  


    @Patch(':uuid')
    @AuthenticationRequired()
    @HasRole(Role.USER)
    @HttpCode(HttpStatus.OK)
    async update(
      @Param('uuid', ParseUUIDPipe) uuid: string,
      @Body(ValidationPipe) updateTaskRequest: UpdateTaskRequest,
    ): Promise<any> {
      return await this.tasksService.update(uuid, updateTaskRequest);
    }
  


    @Delete(':uuid')
    @AuthenticationRequired()
    @HasRole(Role.USER)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<void> {
      return await this.tasksService.delete(uuid);
    }
  }
  