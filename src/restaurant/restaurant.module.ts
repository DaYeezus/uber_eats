import { Module } from '@nestjs/common';

import { RestaurantResolver } from './restaurant.resolver';
import { RestaurantService } from './restaurant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../category/category.entity';
import { RestaurantEntity } from './restaurant.entity';
import { CloudinaryService } from '../cloudinary/clodinary.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, RestaurantEntity]),
    UsersModule,
  ],
  providers: [RestaurantResolver, RestaurantService, CloudinaryService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
