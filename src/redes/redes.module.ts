import { Module } from '@nestjs/common';
import { RedesService } from './redes.service';
import { RedesController } from './redes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redes } from './entities/rede.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Redes])],
  controllers: [RedesController],
  providers: [RedesService],
})
export class RedesModule {}
