import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
 
@Entity()
export class Customer {
 
    @PrimaryGeneratedColumn()
    id: number;
 
    @Column({
        length: 100
    })
    name? : string;
 
    @Column({
        length: 100
    })
    address : string;
 
    @Column({
        length: 10
    })
    phonenumber: string;
 
    @Column()
    age : number;
 
    @Column()
    isEmployeed?: boolean;
}