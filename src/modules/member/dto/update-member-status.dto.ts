import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PersonStatus } from '../../../common/enums/person-status.enum';

export class UpdateMemberStatusDto {
  @ApiProperty({ enum: PersonStatus })
  @IsEnum(PersonStatus)
  status!: PersonStatus;
}
