import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberController } from './member.controller';
import { Member } from './entities/member.entity';
import { MemberService } from './member.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService, TypeOrmModule],
})
export class MemberModule {}
