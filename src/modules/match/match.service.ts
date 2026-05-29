import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  create(payload: CreateMatchDto): Promise<Match> {
    const match = this.matchRepository.create({
      ...payload,
      homeScore: payload.home_score,
      awayScore: payload.away_score,
      played: new Date(payload.played),
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
    Object.assign(match, {
      ...(payload.home ? { home: payload.home } : {}),
      ...(payload.away ? { away: payload.away } : {}),
      ...(payload.home_score !== undefined ? { homeScore: payload.home_score } : {}),
      ...(payload.away_score !== undefined ? { awayScore: payload.away_score } : {}),
      ...(payload.played ? { played: new Date(payload.played) } : {}),
      ...(payload.location ? { location: payload.location } : {}),
    });
    return this.matchRepository.save(match);
  }

  async remove(id: string): Promise<void> {
    const match = await this.findById(id);
    await this.matchRepository.remove(match);
  }
}
