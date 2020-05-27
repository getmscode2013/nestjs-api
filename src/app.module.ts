import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';


@Module({
  imports: [TypeOrmModule.forRoot(), CustomerModule ],
  controllers: [AppController],
  providers: [AppService,
    { provide : APP_FILTER,
    useClass : HttpErrorFilter }
  ]
})
export class AppModule {}
