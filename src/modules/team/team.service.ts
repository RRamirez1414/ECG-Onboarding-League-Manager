import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeagueManagerValidationService } from '../../common/services/league-manager-validation.service';
import { Match } from '../match/entities/match.entity';
import { Member } from '../member/entities/member.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamMemberQueryDto } from './dto/team-member-query.dto';
import { UpdateTeamStatusDto } from './dto/update-team-status.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly leagueValidation: LeagueManagerValidationService,
  ) {}

  async create(payload: CreateTeamDto): Promise<Team> {
    await this.leagueValidation.assertUniqueTeamName(payload.name);
    await this.ensureMemberExists(payload.coach);
    if (payload.captain) {
      await this.ensureMemberExists(payload.captain);
    }

    const team = this.teamRepository.create(payload);
    const saved = await this.teamRepository.save(team);
    await this.syncTeamRoles(saved);
    return saved;
  }

  async findById(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team ${id} not found`);
    }
    return team;
  }

  async getMatches(id: string): Promise<Match[]> {
    await this.findById(id);
    return this.matchRepository.find({
      where: [{ home: id }, { away: id }],
      order: { played: 'DESC' },
    });
  }

  async getMembers(id: string, query: TeamMemberQueryDto): Promise<Member[]> {
    await this.findById(id);
    const qb = this.memberRepository
      .createQueryBuilder('member')
      .where('member.team_id = :id', { id });

    if (query.status) {
      qb.andWhere('member.status = :status', { status: query.status });
    }
    if (query.role) {
      qb.andWhere('member.role = :role', { role: query.role });
    }

    return qb.getMany();
  }

  async getStats(id: string) {
    const [matches, players] = await Promise.all([
      this.getMatches(id),
      this.memberRepository.count({ where: { teamId: id } }),
    ]);

    let win = 0;
    let loss = 0;
    for (const match of matches) {
      const teamScore = match.home === id ? match.homeScore : match.awayScore;
      const opponentScore = match.home === id ? match.awayScore : match.homeScore;
      if (teamScore > opponentScore) {
        win += 1;
      } else if (teamScore < opponentScore) {
        loss += 1;
      }
    }

    return {
      win,
      loss,
      players,
      matches: matches.length,
    };
  }

  async update(id: string, payload: UpdateTeamDto): Promise<Team> {
    const team = await this.findById(id);
    const previousCoach = team.coach;
    const previousCaptain = team.captain;

    if (payload.name) {
      await this.leagueValidation.assertUniqueTeamName(payload.name, id);
    }
    if (payload.coach) {
      await this.ensureMemberExists(payload.coach);
    }
    if (payload.captain) {
      await this.ensureMemberExists(payload.captain);
    }

    Object.assign(team, payload);
    const saved = await this.teamRepository.save(team);
    await this.syncTeamRoles(saved);
    await this.clearRemovedRoles(id, previousCoach, previousCaptain, saved);
    return saved;
  }

  async updateStatus(id: string, payload: UpdateTeamStatusDto): Promise<Team> {
    const team = await this.findById(id);
    team.status = payload.status;
    return this.teamRepository.save(team);
  }

  async remove(id: string): Promise<void> {
    const team = await this.findById(id);
    await this.teamRepository.remove(team);
  }

  private async ensureMemberExists(memberId: string): Promise<void> {
    const member = await this.memberRepository.findOne({ where: { id: memberId } });
    if (!member) {
      throw new NotFoundException(`Member ${memberId} not found`);
    }
  }

  private async syncTeamRoles(team: Team): Promise<void> {
    const roleMemberIds = new Set([team.coach, team.captain].filter(Boolean) as string[]);

    for (const memberId of roleMemberIds) {
      const member = await this.memberRepository.findOne({ where: { id: memberId } });
      if (member && member.teamId !== team.id) {
        await this.leagueValidation.assertTeamHasCapacity(team.id);
        await this.memberRepository.update(memberId, { teamId: team.id });
      }
    }
  }

  private async clearRemovedRoles(
    teamId: string,
    previousCoach: string,
    previousCaptain: string | null | undefined,
    team: Team,
  ): Promise<void> {
    const currentRoles = new Set([team.coach, team.captain].filter(Boolean) as string[]);
    const previousRoles = [previousCoach, previousCaptain].filter(Boolean) as string[];

    for (const memberId of previousRoles) {
      if (currentRoles.has(memberId)) {
        continue;
      }

      const member = await this.memberRepository.findOne({ where: { id: memberId } });
      if (member?.teamId === teamId) {
        await this.memberRepository.update(memberId, { teamId: null });
      }
    }
  }
}
