import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchModule } from '../match/match.module';
import { Match } from '../match/entities/match.entity';
import { Member } from '../member/entities/member.entity';
import { TeamModule } from '../team/team.module';
import { Team } from '../team/entities/team.entity';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Team, Match]),
    TeamModule,
    MatchModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
