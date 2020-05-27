import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from './entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { customerDTO  } from './customerDTO';


@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController],
  providers: [CustomerService]
})
export class CustomerModule {}
