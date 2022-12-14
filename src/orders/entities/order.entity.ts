import { CoreEntity } from '../../common/entities/core.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { UserEntity } from '../../users/user.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';
import { GraphQLFloat } from 'graphql/type';
import { OrderItemEntity } from './order-item.entity';
import { IsArray, IsEnum } from 'class-validator';

export enum OrderStatus {
  Pending = 'Pending',
  Cooking = 'Cooking',
  Cooked = 'Cooked',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
  Canceled = 'Canceled',
}
registerEnumType(OrderStatus, { name: 'orderStatus' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class OrderEntity extends CoreEntity {
  @ManyToOne((type) => UserEntity, (user) => user.orders, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @Field((type) => UserEntity, { nullable: true })
  customer?: UserEntity;
  @RelationId((order: OrderEntity) => order.customer)
  customerId: number;
  @ManyToOne((type) => UserEntity, (user) => user.rides, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @Field((type) => UserEntity, { nullable: true })
  driver?: UserEntity;
  @RelationId((order: OrderEntity) => order.driver)
  driverId: number;
  @Field((type) => RestaurantEntity, { nullable: false })
  @ManyToOne((type) => RestaurantEntity, (restaurant) => restaurant.orders, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  restaurant: RestaurantEntity;

  @Field((type) => [OrderItemEntity])
  @ManyToMany((type) => OrderItemEntity, { eager: true })
  @JoinTable()
  @IsArray()
  items: OrderItemEntity[];
  @Column({ nullable: false, type: 'float' })
  @Field((type) => GraphQLFloat, { nullable: false })
  totalCost: number;
  @Column({ nullable: false, enum: OrderStatus, default: OrderStatus.Pending })
  @Field((type) => OrderStatus, { nullable: false })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
