import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchModule } from '../match/match.module';
import { Audit } from '../../database/entities/audit.entity';
import { Match } from '../match/entities/match.entity';
import { Member } from '../member/entities/member.entity';
import { Staff } from '../staff/entities/staff.entity';
import { TeamModule } from '../team/team.module';
import { Team } from '../team/entities/team.entity';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Staff, Team, Match, Audit]),
    TeamModule,
    MatchModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
