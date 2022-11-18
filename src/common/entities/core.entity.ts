import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field } from '@nestjs/graphql';

export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => Number, { nullable: false, name: 'id' })
  id: number;
  @CreateDateColumn({ name: 'createdAt', type: 'date' })
  @Field((type) => Date)
  createdAt: Date;
  @UpdateDateColumn({ name: 'updatedAt', type: 'date' })
  @Field((type) => Date)
  updatedAt: Date;
  @Column({ default: true })
  @Field((type) => Boolean, { defaultValue: true })
  isActive: Boolean;
}