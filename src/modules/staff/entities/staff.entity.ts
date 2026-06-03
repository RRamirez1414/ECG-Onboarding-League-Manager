import { ApiProperty } from '@nestjs/swagger';
import { ChildEntity, Column } from 'typeorm';
import { Person } from '../../person/entities/person.entity';

@ChildEntity('staff')
export class Staff extends Person {
  @ApiProperty({ description: 'Hourly salary' })
  @Column({ type: 'int', default: 0 })
  wage!: number;

  @ApiProperty({ description: 'Date of hire' })
  @Column({ name: 'hire_date', type: 'date' })
  hireDate!: string;
}
