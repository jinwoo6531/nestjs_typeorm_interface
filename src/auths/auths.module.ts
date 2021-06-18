import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { AuthsRepository } from './auths.repository';
import { UsersRepository } from '../users/users.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtConfigService } from '../common/configurations/jwt.config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    TypeOrmModule.forFeature([AuthsRepository]),
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  providers: [AuthsService, JwtStrategy],
  controllers: [AuthsController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthsModule {}
