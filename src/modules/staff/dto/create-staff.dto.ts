import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { MinimumAge } from '../../../common/validators/minimum-age.validator';

export class CreateStaffDto {
  @ApiProperty()
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ name: 'last_name' })
  @IsString()
  @MaxLength(120)
  last_name!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsDateString()
  @MinimumAge()
  dob!: string;

  @ApiProperty({ description: 'Hourly salary (required on creation)' })
  @IsInt()
  @Min(1)
  wage!: number;

  @ApiPropertyOptional({ description: 'Date of hire (defaults to today)' })
  @IsOptional()
  @IsDateString()
  hire_date?: string;
}
