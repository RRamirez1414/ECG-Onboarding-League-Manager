import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../modules/match/entities/match.entity';
import { Member } from '../modules/member/entities/member.entity';
import { Team } from '../modules/team/entities/team.entity';
import { LeagueManagerValidationService } from './services/league-manager-validation.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Team, Member, Match])],
  providers: [LeagueManagerValidationService],
  exports: [LeagueManagerValidationService],
})
export class CommonModule {}
