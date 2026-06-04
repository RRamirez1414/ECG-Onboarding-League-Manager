import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeagueManagerValidationService } from '../../common/services/league-manager-validation.service';
import { Staff } from '../staff/entities/staff.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly leagueValidation: LeagueManagerValidationService,
  ) {}

  async create(payload: CreateMatchDto): Promise<Match> {
    this.assertDistinctTeams(payload.home, payload.away);
    if (payload.referee) {
      await this.ensureStaffReferee(payload.referee);
    }

    const played = new Date(payload.played);
    await this.leagueValidation.assertNoMatchScheduleConflict(played, payload.location);

    const match = this.matchRepository.create({
      home: payload.home,
      away: payload.away,
      homeScore: payload.home_score,
      awayScore: payload.away_score,
      played,
      location: payload.location,
      referee: payload.referee,
    });
    return this.matchRepository.save(match);
  }

  async findById(id: string): Promise<Match> {
    const match = await this.matchRepository.findOne({ where: { id } });
    if (!match) {
      throw new NotFoundException(`Match ${id} not found`);
    }
    return match;
  }

  async update(id: string, payload: UpdateMatchDto): Promise<Match> {
    const match = await this.findById(id);
    if (payload.referee) {
      await this.ensureStaffReferee(payload.referee);
    }

    Object.assign(match, {
      ...(payload.home ? { home: payload.home } : {}),
      ...(payload.away ? { away: payload.away } : {}),
      ...(payload.home_score !== undefined ? { homeScore: payload.home_score } : {}),
      ...(payload.away_score !== undefined ? { awayScore: payload.away_score } : {}),
      ...(payload.played ? { played: new Date(payload.played) } : {}),
      ...(payload.location ? { location: payload.location } : {}),
      ...(payload.referee !== undefined ? { referee: payload.referee } : {}),
    });
    this.assertDistinctTeams(match.home, match.away);

    const played = match.played;
    const location = match.location;
    await this.leagueValidation.assertNoMatchScheduleConflict(played, location, id);

    return this.matchRepository.save(match);
  }

  async remove(id: string): Promise<void> {
    const match = await this.findById(id);
    await this.matchRepository.remove(match);
  }

  private assertDistinctTeams(home: string, away: string): void {
    if (home === away) {
      throw new BadRequestException('Home and away teams must be different');
    }
  }

  private async ensureStaffReferee(refereeId: string): Promise<void> {
    const staff = await this.staffRepository.findOne({ where: { id: refereeId } });
    if (!staff) {
      throw new BadRequestException('Referee must be a valid staff member');
    }
  }
}
