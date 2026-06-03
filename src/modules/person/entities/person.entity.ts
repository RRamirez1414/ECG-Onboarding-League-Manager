import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';
import { PersonRole } from '../../../common/enums/person-role.enum';
import { PersonStatus } from '../../../common/enums/person-status.enum';

@Entity('person')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Person {
  @ApiProperty()
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
}
