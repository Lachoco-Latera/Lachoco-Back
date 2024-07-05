import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeOrm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { FlavorModule } from './flavor/flavor.module';
import { EmailModule } from './email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CategoryModule } from './category/category.module';
import { SuscriptionModule } from './suscription/suscription.module';
import { PagosModule } from './pagos/pagos.module';
import { GitfcardsModule } from './gitfcards/gitfcards.module';
import { RedesModule } from './redes/redes.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ShipmentsModule } from './shipments/shipments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    ProductModule,
    OrderModule,
    FlavorModule,
    EmailModule,
    CategoryModule,
    SuscriptionModule,
    PagosModule,
    GitfcardsModule,
    RedesModule,
    ShipmentsModule,
  ],
})
export class AppModule {}
