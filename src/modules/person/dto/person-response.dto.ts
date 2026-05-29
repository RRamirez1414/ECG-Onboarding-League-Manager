import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PersonRole } from '../../../common/enums/person-role.enum';
import { PersonStatus } from '../../../common/enums/person-status.enum';

export class PersonResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ name: 'last_name' })
  lastName!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  phone?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  email?: string | null;

  @ApiProperty()
  dob!: string;

  @ApiProperty({ enum: PersonRole })
  role!: PersonRole;

  @ApiProperty({ enum: PersonStatus })
  status!: PersonStatus;

  @ApiProperty()
  age!: number;
}
