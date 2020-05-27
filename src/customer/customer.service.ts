import { Injectable } from '@nestjs/common';
import {Repository} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';

import {Customer} from './entity'
import { customerDTO } from './customerDTO';


@Injectable()
export class CustomerService {
// Using decorator @InjectRepository for dependency injection and injecting repository to service

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