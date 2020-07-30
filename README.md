# nestjs-api


https://www.youtube.com/watch?v=EHlhvy-fh90&list=PLBeQxJQNprbiJm55q7nTAfhMmzIC8MWxc&index=2

---------------------------
1. Connecting to database
---------------------------

0. Creating projects as
npx @nestjs/cli new nest-Api

1. adding dotenv for maintaining the configuration.

npm add dotenv

Than add the envinoment(.env) file in application
type nul > .env 

*** type nul > your_file.txt  // type nul > command use to create new file in nodejs
- >   Creates a new file
- >>  Preserves content of the file

2. It use to define the configuration file.
lets open .env and write
.env 
PORT=5000

2.1 Add package for auto import as
$ npm install --save-dev auto-import

3. Get that port number into mail.ts

// impoting it
import 'dotenv/config'

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

// Get value
const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Use value for listen port
  await app.listen(port);
    Logger.log(`Application running on http://localhost:${port}`,"Application Running")

}
bootstrap();

// Run application npm run start:dev

4. Now install typeORM like below.
npm install typeorm --save
https://www.npmjs.com/package/typeorm

You may need to install node typings:
npm install @types/node --save

either way you can install
npm install mssql typeorm @nestjs/typeorm

5. Adding the ormconfig.json
type nul > ormconfig.json


6. If you are facing issue as
error  TS2417: Class static side 'typeof _Readable' incorrectly extends base class static side 'typeof Readable'.
  The types of 'Stream.Readable.Writable' are incompatible between these types.
solution : https://stackoverflow.com/questions/61947491/class-static-side-typeof-readable-incorrectly-extends-base-class-static-side

you need to install below package
npm i -D -E @types/readable-stream@2.3.5


7. Now create the ormconfig.json in top level folder and placed the code for connaction to database.
Like below:

{
    "type": "mssql",
    "host": "REETPC",
    "port": 1433,
    "username": "sa",
    "password": "password1",
    "database": "test12",
    "synchronize": true,
    "entities": [
       "dist/Entity/*.js"
    ],
    "cli": {
       "entitiesDir": "src/entity"
    }
 }
 
 look for 
 "entities": [
       "dist/Entity/*.js"
    ],

Path should be correct fo entities.
"synchronize": true,

If you want to sync of database with your code.

8. Adding the entity of customer as like below
in entity/customer.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
 
@Entity()
export class Customer {
 
    @PrimaryGeneratedColumn()
    id: number;
 
    @Column({
        length: 100
    })
    name: string;
 
    @Column({
        length: 100
    })
    address: string;
 
    @Column()
    phonenumber: string;
 
    @Column()
    age: number;
 
    @Column()
    isEmployeed: boolean;
}

9. Import the modules of Node/typeORM into app.module.ts

// Typeorm
import { TypeOrmModule } from '@nestjs/typeorm'

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
// import the typeorm
  imports: [TypeOrmModule.forRoot() ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
.

----------------------------------
Day 2: Implementing CRUD Operation
----------------------------------

1.  Sometime you are facing the problem to run the nest command in terminal.
Open ihe Nodecommand promt and use below command to add.
Module : in Customer folder
nest g mo customer

Controller : Adding the controller
nest g controller customer

Service : Adding the services, by default it will generate in root but we want it to inside of customer folder.
nest g service customer

*** If you will add the file using command promt it will add refrence automatically.

2. You got all the files. Now lets work with controller and create the templates for exposing method for APi.



3. Adding the TypeOrmModule to import of customer.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from './entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';


@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController],
  providers: [CustomerService]
})
export class CustomerModule {}

4. Create a customer DTO

export interface customerDTO
{
    name : string;
}

5. Now adding the code in Service to get the data from database.

import { Injectable } from '@nestjs/common';
import {Repository} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';

import {Customer} from './entity'
import { customerDTO } from './customerDTO';


@Injectable()
export class CustomerService {
// Using decorator @InjectRepository for dependency injection and injecting repository to service


// Injecting the customer repository 
constructor( 
    @InjectRepository(Customer)
    private customerRepository : Repository<Customer>){}


    async GetAllCustomer()
    {
       return await this.customerRepository.find();
    }

    async AddCustomer(data : customerDTO)
    {
        const cust =  await this.customerRepository.create(data)
        await this.customerRepository.save(cust);
       return  cust;
    }

    async GetCustomerbyID(id : number)
    {
        return await this.customerRepository.find({where : {id : id}});
    }

    // Partial keyword, if you will not pass all the data also it will not give any error.
    async UpdateCustomer(id: number ,data : Partial<customerDTO>)
    {
        await this.customerRepository.update({ id: id},data);
        return await this.customerRepository.find({where : {id : id}});
    }

    async DeleteCustomer(id : string)
    {
        return await this.customerRepository.delete({ id : parseInt(id)});
        return {deleted : true};
    }

}

6. Adding code for controller just to expose from outside.

import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import {CustomerService} from './customer.service'
import { customerDTO } from './customerDTO';

@Controller('customer')
export class CustomerController {

// Injecting the customerServive to the construtor as follow the dependency injection.
    constructor(private customerService : CustomerService){}

@Get()
GetAllCustomer()
{
    return this.customerService.GetAllCustomer();
}

@Post()
AddCustomer(@Body() data : customerDTO)
{
    return this.customerService.AddCustomer(data);
}

@Get(':id')
GetCustomerByID(@Param('id') id: number)
{
    return this.customerService.GetCustomerbyID(id);
}

@Put(':id')
UpdateCustomer(@Param('id') id: number,@Body() data : Partial<customerDTO>)
{
    return this.customerService.UpdateCustomer(id, data);
}

@Delete(':id')
DeleteCustomerbyID(@Param('id') id: string)
{
    return this.customerService.DeleteCustomer(id);
}

}
	
7. Checking into postman

http://localhost:5000/customer   // use to get all data select get in postman

http://localhost:5000/customer // Use to add new records, select post in postman.
 {
         "name": "Prakash",
        "address": "Hyderbad",
        "phonenumber": "435456676",
        "age": 23,
        "isEmployeed": true
}

http://localhost.5000/customer/1 // use to get ony one data select get.
http://localhost.5000/customer/1 // use to delete one data select Delete.


-------------------------------------------------
3 - Error and logging 
-------------------------------------------------
	
	1. Create folder "shared" where we maintain the error handling.
E:\nest-api\src>mkdir shared

2. As we are going to handle http error, so creating a file http-error.filter.cs.
E:\nest-api\src\shared>type nul > http-error.filter.ts


3. Write the write filter  for http errors.

4. Register it to app module, in provider.
 providers: [AppService,
  {
    provide : APP_FILTER,
    useClass : HttpErrorFilter
  }],
  
  
 ----------------------------------------
 4 - Intercepter
 ----------------------------------------
 

 1..  Interceptors have a set of useful capabilities.
 - bind extra logic before / after method execution
 - transform the result returned from a function
 - transform the exception thrown from a function.
 - extend the basic function behavior
- completely override a function depending on specific conditions (e.g., for caching purposes)

 2. You can get more details about interceptor here also.
 https://docs.nestjs.com/interceptors
 
 3. In our usecase we will see how much time method will take for request and response and log that.
 
4. Create folder "shared" where we maintain the error handling.
E:\nest-api\src>mkdir shared

5. As we are going to handle http error, so creating a file http-error.filter.cs.
E:\nest-api\src\shared>type nul >logging.interceptor.ts
 
 
 
