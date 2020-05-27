import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import {CustomerService} from './customer.service'
import { customerDTO } from './customerDTO';

@Controller('customer')
export class CustomerController {

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