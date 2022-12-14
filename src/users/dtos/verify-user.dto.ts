import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class VerifyUserDto {
  @Field((type) => Number, { name: 'verificationCode', nullable: false })
  @IsNumber()
  verificationCode: number;
}
