import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LEAGUE_MANAGER_LIMITS } from '../constants/league-manager-limits';
import { isAtLeastAge } from '../utils/age.util';
import { Match } from '../../modules/match/entities/match.entity';
import { Member } from '../../modules/member/entities/member.entity';
import { Team } from '../../modules/team/entities/team.entity';

@Injectable()
export class LeagueManagerValidationService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  assertMinimumAge(dob: string, label = 'Person'): void {
    if (!isAtLeastAge(dob, LEAGUE_MANAGER_LIMITS.MIN_AGE)) {
      throw new BadRequestException(`${label} must be at least ${LEAGUE_MANAGER_LIMITS.MIN_AGE} years old`);
    }
  }

  assertHasContact(phone?: string | null, email?: string | null): void {
    const hasPhone = Boolean(phone?.trim());
    const hasEmail = Boolean(email?.trim());
    if (!hasPhone && !hasEmail) {
      throw new BadRequestException('At least one form of contact is required (phone or email)');
    }
  }

  async assertUniqueTeamName(name: string, excludeTeamId?: string): Promise<void> {
    const qb = this.teamRepository
      .createQueryBuilder('team')
      .where('LOWER(team.name) = LOWER(:name)', { name: name.trim() });

    if (excludeTeamId) {
      qb.andWhere('team.id != :excludeTeamId', { excludeTeamId });
    }

    const existing = await qb.getOne();
    if (existing) {
      throw new BadRequestException(`A team named "${name}" already exists`);
    }
  }

  async assertTeamHasCapacity(teamId: string, additionalMembers = 1): Promise<void> {
    const currentCount = await this.memberRepository.count({ where: { teamId } });
    if (currentCount + additionalMembers > LEAGUE_MANAGER_LIMITS.MAX_MEMBERS_PER_TEAM) {
      throw new BadRequestException(
        `Team cannot exceed ${LEAGUE_MANAGER_LIMITS.MAX_MEMBERS_PER_TEAM} members (current: ${currentCount})`,
      );
    }
  }

  async assertNoMatchScheduleConflict(
    played: Date,
    location: string,
    excludeMatchId?: string,
  ): Promise<void> {
    const qb = this.matchRepository
      .createQueryBuilder('match')
      .where('match.played = :played', { played })
      .andWhere('LOWER(match.location) = LOWER(:location)', { location: location.trim() });

    if (excludeMatchId) {
      qb.andWhere('match.id != :excludeMatchId', { excludeMatchId });
    }

    const conflict = await qb.getOne();
    if (conflict) {
      throw new BadRequestException(
        'A match is already scheduled at this location at the same time',
      );
    }
  }
}
