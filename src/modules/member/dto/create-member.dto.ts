import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PersonRole } from '../../../common/enums/person-role.enum';

export class CreateMemberDto {
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
  dob!: string;

  @ApiProperty({ enum: PersonRole })
  @IsEnum(PersonRole)
  role!: PersonRole;
}
