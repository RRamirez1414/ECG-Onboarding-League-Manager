import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../match/entities/match.entity';
import { Member } from '../member/entities/member.entity';
import { TeamController } from './team.controller';
import { Team } from './entities/team.entity';
import { TeamService } from './team.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Member, Match])],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
