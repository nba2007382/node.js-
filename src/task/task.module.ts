import { DbModule } from '@libs/db';
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';

@Module({
  imports: [DbModule],
  providers: [TaskService]
})
export class TaskModule {}
