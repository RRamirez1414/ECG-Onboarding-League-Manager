import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonResponseDto } from './dto/person-response.dto';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async findById(id: string): Promise<PersonResponseDto> {
    const person = await this.personRepository.findOne({ where: { id } });
    if (!person) {
      throw new NotFoundException(`Person ${id} not found`);
    }

    const {
      teamId: _teamId,
      stats: _stats,
      wage: _wage,
      hireDate: _hireDate,
      team: _team,
      ...personData
    } = person as Person & {
      teamId?: string;
      stats?: Record<string, unknown>;
      wage?: number;
      hireDate?: string;
      team?: unknown;
    };

    return personData;
  }
}
