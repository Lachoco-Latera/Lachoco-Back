import { Module } from '@nestjs/common';
import { RecurrentsService } from './recurrents.service';
import { RecurrentsController } from './recurrents.controller';

@Module({
  controllers: [RecurrentsController],
  providers: [RecurrentsService],
})
export class RecurrentsModule {}
