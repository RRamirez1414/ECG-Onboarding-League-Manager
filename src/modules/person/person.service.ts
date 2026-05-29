import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../member/entities/member.entity';
import { PersonResponseDto } from './dto/person-response.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Member)
    private readonly personRepository: Repository<Member>,
  ) { }

  async findById(id: string): Promise<PersonResponseDto> {
    const person = await this.personRepository.findOne({ where: { id } });
    if (!person) {
      throw new NotFoundException(`Person ${id} not found`);
    }

    const { teamId: _teamId, stats: _stats, ...personData } = person;
    return personData;
  }
}
