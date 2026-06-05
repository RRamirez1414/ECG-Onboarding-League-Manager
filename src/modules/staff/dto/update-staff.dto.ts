import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PersonStatus } from '../../../common/enums/person-status.enum';
import { MinimumAge } from '../../../common/validators/minimum-age.validator';

export class UpdateStaffDto {
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

  @ApiPropertyOptional({ enum: PersonStatus })
  @IsOptional()
  @IsEnum(PersonStatus)
  status?: PersonStatus;

  @ApiPropertyOptional({ description: 'Hourly salary' })
  @IsOptional()
  @IsInt()
  @Min(0)
  wage?: number;

  @ApiPropertyOptional({ description: 'Date of hire' })
  @IsOptional()
  @IsDateString()
  hire_date?: string;
}
