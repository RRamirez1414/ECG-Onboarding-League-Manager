import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeagueManagerValidationService } from '../../common/services/league-manager-validation.service';
import { PersonRole } from '../../common/enums/person-role.enum';
import { PersonStatus } from '../../common/enums/person-status.enum';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly leagueValidation: LeagueManagerValidationService,
  ) {}

  create(payload: CreateStaffDto): Promise<Staff> {
    this.leagueValidation.assertMinimumAge(payload.dob, 'Staff member');

    const staff = this.staffRepository.create({
      name: payload.name,
      lastName: payload.last_name,
      phone: payload.phone,
      email: payload.email,
      dob: payload.dob,
      role: PersonRole.STAFF,
      status: PersonStatus.ACTIVE,
      wage: payload.wage,
      hireDate: payload.hire_date ?? new Date().toISOString().slice(0, 10),
    });
    return this.staffRepository.save(staff);
  }

  async findById(id: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({ where: { id } });
    if (!staff) {
      throw new NotFoundException(`Staff ${id} not found`);
    }
    return staff;
  }

  async update(id: string, payload: UpdateStaffDto): Promise<Staff> {
    const staff = await this.findById(id);

    if (payload.dob) {
      this.leagueValidation.assertMinimumAge(payload.dob, 'Staff member');
    }

    Object.assign(staff, {
      ...(payload.name ? { name: payload.name } : {}),
      ...(payload.last_name ? { lastName: payload.last_name } : {}),
      ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
      ...(payload.email !== undefined ? { email: payload.email } : {}),
      ...(payload.dob ? { dob: payload.dob } : {}),
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.wage !== undefined ? { wage: payload.wage } : {}),
      ...(payload.hire_date ? { hireDate: payload.hire_date } : {}),
    });
    return this.staffRepository.save(staff);
  }

  async remove(id: string): Promise<void> {
    const staff = await this.findById(id);
    await this.staffRepository.remove(staff);
  }
}
