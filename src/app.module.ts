import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './common/configurations/typeorm.config';
import { AuthsModule } from './auths/auths.module';
import { CategoriesModule } from './categories/categories.module';
import { ImagesModule } from './images/images.module';

import { ProductsModule } from './products/products.module';
import { StoresModule } from './stores/stores.module';
import { UsersModule } from './users/users.module';
import { FavoritesModule } from './favorites/favorites.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../.development.env', '../.production.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthsModule,
    CategoriesModule,
    ImagesModule,
    ProductsModule,
    StoresModule,
    UsersModule,
    FavoritesModule,
    TagsModule,
  ],
})
export class AppModule {}
