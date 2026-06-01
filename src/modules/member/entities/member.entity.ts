import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PersonRole } from '../../../common/enums/person-role.enum';
import { PersonStatus } from '../../../common/enums/person-status.enum';
import { Team } from '../../team/entities/team.entity';

@Entity('person')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @ApiProperty({ name: 'last_name' })
  @Column({ name: 'last_name', type: 'varchar', length: 120 })
  lastName!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 180, nullable: true })
  email?: string | null;

  @ApiProperty()
  @Column({ type: 'date' })
  dob!: string;

  @ApiProperty({ enum: PersonRole })
  @Column({ type: 'enum', enum: PersonRole })
  role!: PersonRole;

  @ApiProperty({ enum: PersonStatus })
  @Column({ type: 'enum', enum: PersonStatus, default: PersonStatus.ACTIVE })
  status!: PersonStatus;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  age!: number;

  @ApiPropertyOptional({
    description: 'Foreign key to team',
    type: String,
    nullable: true,
  })
  @Column({ name: 'team_id', type: 'uuid', nullable: true })
  teamId?: string | null;

  @ApiProperty({
    description: 'Member stats as JSON',
    example: { shots_on_goal: 56, total_shots_on_goal: 80 },
    type: 'object',
    additionalProperties: true,
  })
  @Column({ type: 'jsonb', default: () => "'{}'" })
  stats!: Record<string, unknown>;

  @ManyToOne(() => Team, (team) => team.members, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team?: Team | null;

  @BeforeInsert()
  @BeforeUpdate()
  setAgeFromDob() {
    if (!this.dob) {
      return;
    }

    const birthDate = new Date(this.dob);
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    this.age = Math.max(age, 0);
  }
}
