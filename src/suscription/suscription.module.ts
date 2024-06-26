import { Module } from '@nestjs/common';
import { SuscriptionService } from './suscription.service';
import { SuscriptionController } from './suscription.controller';
import { EmailService } from 'src/email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SuscriptionController],
  providers: [SuscriptionService, EmailService],
})
export class SuscriptionModule {}
