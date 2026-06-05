import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { PersonRole } from '../../../common/enums/person-role.enum';
import { MinimumAge } from '../../../common/validators/minimum-age.validator';

export class UpdateMemberDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ name: 'last_name' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  last_name?: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  @MinimumAge()
  dob?: string;

  @ApiPropertyOptional({ enum: PersonRole })
  @IsOptional()
  @IsEnum(PersonRole)
  role?: PersonRole;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsUUID()
  team_id?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  stats?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  fee?: number;
}
