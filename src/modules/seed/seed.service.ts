import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audit } from '../../database/entities/audit.entity';
import { PersonRole } from '../../common/enums/person-role.enum';
import { PersonStatus } from '../../common/enums/person-status.enum';
import { TeamStatus } from '../../common/enums/team-status.enum';
import { MatchService } from '../match/match.service';
import { Member } from '../member/entities/member.entity';
import { Staff } from '../staff/entities/staff.entity';
import { TeamService } from '../team/team.service';
import { Match } from '../match/entities/match.entity';
import { Team } from '../team/entities/team.entity';

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Quinn',
  'Sam', 'Drew', 'Chris', 'Pat', 'Avery', 'Blake', 'Cameron', 'Dakota',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Thomas', 'Lee',
];

const TEAM_NAMES = ['FC Thunder', 'River City', 'North Stars', 'Coastal United'];

const LOCATIONS = [
  'Main Stadium, 100 League Ave',
  'North Park Field, 22 Oak St',
  'Riverside Arena, 8 Water Ln',
  'Coastal Grounds, 45 Beach Rd',
];

const PLAYER_ROLES = [
  PersonRole.GOALKEEPER,
  PersonRole.DEFENDER,
  PersonRole.MIDFIELDER,
  PersonRole.FORWARD,
];

const CAPTAIN_ROLES = [PersonRole.MIDFIELDER, PersonRole.FORWARD, PersonRole.DEFENDER];

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
    private readonly teamService: TeamService,
    private readonly matchService: MatchService,
  ) {}

  async seed(clearExisting = true) {
    if (clearExisting) {
      await this.clearAll();
    }

    const freeAgents = await this.createFreeAgents(4);
    const referees = await this.createReferees(3);
    const teams: Team[] = [];

    for (const teamName of TEAM_NAMES) {
      const team = await this.createTeamWithSquad(teamName);
      teams.push(team);
    }

    const matches = await this.createMatches(teams, referees, 10);

    return {
      cleared: clearExisting,
      members: await this.memberRepository.count(),
      staff: await this.staffRepository.count(),
      teams: teams.length,
      matches: matches.length,
      freeAgents: freeAgents.length,
      audits: await this.auditRepository.count(),
    };
  }

  private async clearAll(): Promise<void> {
    await this.auditRepository.createQueryBuilder().delete().execute();
    await this.matchRepository.createQueryBuilder().delete().execute();
    await this.teamRepository.createQueryBuilder().delete().execute();
    await this.memberRepository.createQueryBuilder().delete().execute();
    await this.staffRepository.createQueryBuilder().delete().execute();
  }

  private async createFreeAgents(count: number): Promise<Member[]> {
    const agents: Member[] = [];
    for (let i = 0; i < count; i += 1) {
      agents.push(
        await this.createMember({
          role: this.pick(PLAYER_ROLES),
          status: i === 0 ? PersonStatus.INACTIVE : PersonStatus.ACTIVE,
        }),
      );
    }
    return agents;
  }

  private async createReferees(count: number): Promise<Staff[]> {
    const referees: Staff[] = [];
    for (let i = 0; i < count; i += 1) {
      referees.push(await this.createStaff(PersonRole.STAFF));
    }
    return referees;
  }

  private async createTeamWithSquad(name: string): Promise<Team> {
    const coach = await this.createMember({ role: PersonRole.COACH });
    const squadSize = this.randomInt(10, 14);
    const players: Member[] = [];

    for (let i = 0; i < squadSize; i += 1) {
      players.push(await this.createMember({ role: this.pickPlayerRole(i, squadSize) }));
    }

    const captainCandidates = players.filter((p) => CAPTAIN_ROLES.includes(p.role));
    const captain = this.pick(captainCandidates.length ? captainCandidates : players);

    const team = await this.teamService.create({
      name,
      coach: coach.id,
      captain: captain.id,
      status: TeamStatus.ACTIVE,
    });

    for (const player of players) {
      if (player.id === captain.id) {
        continue;
      }
      await this.memberRepository.update(player.id, {
        teamId: team.id,
        stats: this.randomPlayerStats(),
      });
    }

    await this.memberRepository.update(captain.id, { stats: this.randomPlayerStats() });

    return team;
  }

  private async createMatches(
    teams: Team[],
    referees: Staff[],
    count: number,
  ): Promise<Match[]> {
    const matches: Match[] = [];
    const usedPairs = new Set<string>();

    for (let i = 0; i < count; i += 1) {
      const home = this.pick(teams);
      let away = this.pick(teams);
      let attempts = 0;
      while (away.id === home.id && attempts < 10) {
        away = this.pick(teams);
        attempts += 1;
      }
      if (away.id === home.id) {
        continue;
      }

      const pairKey = [home.id, away.id].sort().join(':');
      if (usedPairs.has(pairKey)) {
        continue;
      }
      usedPairs.add(pairKey);

      const homeScore = this.randomInt(0, 5);
      const awayScore = this.randomInt(0, 5);
      const daysAgo = this.randomInt(1, 90);

      matches.push(
        await this.matchService.create({
          home: home.id,
          away: away.id,
          home_score: homeScore,
          away_score: awayScore,
          played: this.randomPastDate(daysAgo).toISOString(),
          location: this.pick(LOCATIONS),
          referee: this.pick(referees).id,
        }),
      );
    }

    return matches;
  }

  private async createMember(options: {
    role: PersonRole;
    status?: PersonStatus;
  }): Promise<Member> {
    const firstName = this.pick(FIRST_NAMES);
    const lastName = this.pick(LAST_NAMES);
    const member = this.memberRepository.create({
      name: firstName,
      lastName,
      phone: `${this.randomInt(100, 999)}${this.randomInt(1000000, 9999999)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${this.randomInt(1, 99)}@example.com`,
      dob: this.randomDob(),
      role: options.role,
      status: options.status ?? PersonStatus.ACTIVE,
      stats: options.role === PersonRole.COACH ? {} : this.randomPlayerStats(),
      teamId: null,
    });
    return this.memberRepository.save(member);
  }

  private async createStaff(role: PersonRole): Promise<Staff> {
    const firstName = this.pick(FIRST_NAMES);
    const lastName = this.pick(LAST_NAMES);
    const staff = this.staffRepository.create({
      name: firstName,
      lastName,
      phone: `${this.randomInt(100, 999)}${this.randomInt(1000000, 9999999)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${this.randomInt(1, 99)}@example.com`,
      dob: this.randomDob(),
      role,
      status: PersonStatus.ACTIVE,
      wage: this.randomInt(15, 45),
      hireDate: this.randomHireDate(),
    });
    return this.staffRepository.save(staff);
  }

  private pickPlayerRole(index: number, squadSize: number): PersonRole {
    if (index === 0) {
      return PersonRole.GOALKEEPER;
    }
    if (index < Math.ceil(squadSize * 0.35)) {
      return PersonRole.DEFENDER;
    }
    if (index < Math.ceil(squadSize * 0.7)) {
      return PersonRole.MIDFIELDER;
    }
    return PersonRole.FORWARD;
  }

  private randomPlayerStats(): Record<string, number> {
    const shotsOnGoal = this.randomInt(0, 30);
    return {
      shots_on_goal: shotsOnGoal,
      total_shots_on_goal: shotsOnGoal + this.randomInt(0, 15),
    };
  }

  private randomDob(): string {
    const age = this.randomInt(18, 38);
    const year = new Date().getFullYear() - age;
    const month = this.randomInt(1, 12);
    const day = this.randomInt(1, 28);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  private randomHireDate(): string {
    const yearsAgo = this.randomInt(0, 5);
    const date = new Date();
    date.setFullYear(date.getFullYear() - yearsAgo);
    return date.toISOString().slice(0, 10);
  }

  private randomPastDate(daysAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(this.randomInt(10, 20), 0, 0, 0);
    return date;
  }

  private pick<T>(items: T[]): T {
    return items[this.randomInt(0, items.length - 1)];
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
