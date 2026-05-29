import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PersonRole } from '../../../common/enums/person-role.enum';
import { PersonStatus } from '../../../common/enums/person-status.enum';

export class TeamMemberQueryDto {
  @ApiPropertyOptional({ enum: PersonStatus })
  @IsOptional()
  @IsEnum(PersonStatus)
  status?: PersonStatus;

  @ApiPropertyOptional({ enum: PersonRole })
  @IsOptional()
  @IsEnum(PersonRole)
  role?: PersonRole;
}
