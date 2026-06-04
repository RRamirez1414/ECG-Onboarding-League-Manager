import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { LEAGUE_MANAGER_LIMITS } from '../../common/constants/league-manager-limits';
import { LeagueManagerValidationService } from '../../common/services/league-manager-validation.service';
import { PersonStatus } from '../../common/enums/person-status.enum';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberStatusDto } from './dto/update-member-status.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly leagueValidation: LeagueManagerValidationService,
  ) {}

  create(payload: CreateMemberDto): Promise<Member> {
    this.leagueValidation.assertMinimumAge(payload.dob, 'Member');
    this.leagueValidation.assertHasContact(payload.phone, payload.email);

    const member = this.memberRepository.create({
      name: payload.name,
      lastName: payload.last_name,
      phone: payload.phone,
      email: payload.email,
      dob: payload.dob,
      role: payload.role,
      status: PersonStatus.INACTIVE,
      fee: payload.fee ?? LEAGUE_MANAGER_LIMITS.DEFAULT_MEMBER_FEE,
      stats: {},
      teamId: null,
    });
    return this.memberRepository.save(member);
  }

  async findById(id: string): Promise<Member> {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`Member ${id} not found`);
    }
    return member;
  }

  findFreeAgents(): Promise<Member[]> {
    return this.memberRepository.find({
      where: { teamId: IsNull() },
    });
  }

  async update(id: string, payload: UpdateMemberDto): Promise<Member> {
    const member = await this.findById(id);

    if (payload.dob) {
      this.leagueValidation.assertMinimumAge(payload.dob, 'Member');
    }

    const nextPhone = payload.phone !== undefined ? payload.phone : member.phone;
    const nextEmail = payload.email !== undefined ? payload.email : member.email;
    this.leagueValidation.assertHasContact(nextPhone, nextEmail);

    if (payload.team_id && payload.team_id !== member.teamId) {
      await this.leagueValidation.assertTeamHasCapacity(payload.team_id);
    }

    Object.assign(member, {
      ...(payload.name ? { name: payload.name } : {}),
      ...(payload.last_name ? { lastName: payload.last_name } : {}),
      ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
      ...(payload.email !== undefined ? { email: payload.email } : {}),
      ...(payload.dob ? { dob: payload.dob } : {}),
      ...(payload.role ? { role: payload.role } : {}),
      ...(payload.team_id !== undefined ? { teamId: payload.team_id } : {}),
      ...(payload.stats ? { stats: payload.stats } : {}),
      ...(payload.fee !== undefined ? { fee: payload.fee } : {}),
    });
    return this.memberRepository.save(member);
  }

  async updateStatus(id: string, payload: UpdateMemberStatusDto): Promise<Member> {
    const member = await this.findById(id);
    member.status = payload.status;
    return this.memberRepository.save(member);
  }

  async remove(id: string): Promise<void> {
    const member = await this.findById(id);
    await this.memberRepository.remove(member);
  }
}
