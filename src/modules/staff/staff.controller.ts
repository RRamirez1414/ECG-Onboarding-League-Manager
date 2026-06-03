import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';
import { StaffService } from './staff.service';

@ApiTags('staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @ApiOperation({ summary: 'Create staff (person STI row)' })
  @ApiCreatedResponse({ type: Staff })
  create(@Body() payload: CreateStaffDto) {
    return this.staffService.create(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get staff by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({ type: Staff })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.staffService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update staff' })
  @ApiOkResponse({ type: Staff })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateStaffDto) {
    return this.staffService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete staff' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.staffService.remove(id);
    return { deleted: true };
  }
}
