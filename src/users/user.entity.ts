import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from '../common/entities/core.entity';
import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { OrderEntity } from '../orders/entities/order.entity';

export enum UserRoles {
  Client = 'Client',
  Owner = 'Owner',
  Delivery = 'Delivery',
  Admin = 'Admin',
}

registerEnumType(UserRoles, { name: 'UserRoles' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class UserEntity extends CoreEntity {
  @Column({
    type: 'varchar',
    nullable: false,
    name: 'email',
    unique: true,
    primary: true,
  })
  @Field((type) => String, {
    nullable: false,
    name: 'email',
    description: 'user unique email address',
  })
  @IsString()
  @IsEmail()
  email: string;
  @Column({ type: 'varchar', nullable: false, name: 'password' })
  @Field((type) => String, {
    nullable: false,
    name: 'password',
    description:
      'user password containing Capital and lower case letters and numbers',
  })
  @IsString()
  @Length(8, 16)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRoles,
    nullable: false,
  })
  @Field((type) => UserRoles, {
    name: 'role',
    nullable: false,
    defaultValue: 'Client',
  })
  @IsEnum(UserRoles)
  role: UserRoles;
  @Column({ name: 'isVerified', type: 'boolean', default: false })
  isVerified: boolean;
  @Column({
    name: 'verificationCode',
    type: 'int',
    default: null,
    nullable: true,
  })
  verificationCode: number;
  @Column({ name: 'resetPasswordAttempts', type: 'int', default: 0 })
  resetPasswordAttempts: number;
  @OneToMany((type) => RestaurantEntity, (restaurant) => restaurant.owner)
  @Field((type) => [RestaurantEntity])
  restaurants: RestaurantEntity[];
  @OneToMany((type) => OrderEntity, (order) => order.customer, {
    nullable: true,
  })
  @Field((type) => [OrderEntity], { nullable: true })
  orders?: OrderEntity[];
  @OneToMany((type) => OrderEntity, (order) => order.customer, {
    nullable: true,
  })
  @Field((type) => [OrderEntity], { nullable: true })
  rides?: OrderEntity[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
