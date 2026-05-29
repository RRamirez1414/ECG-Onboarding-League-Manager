import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonController } from './person.controller';
import { Member } from '../member/entities/member.entity';
import { PersonService } from './person.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService, TypeOrmModule],
})
export class PersonModule {}
