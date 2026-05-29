import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';
import { MatchService } from './match.service';

@ApiTags('match')
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @ApiOperation({ summary: 'Create match' })
  @ApiCreatedResponse({ type: Match })
  create(@Body() payload: CreateMatchDto) {
    return this.matchService.create(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get match by id (match only)' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({ type: Match })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.matchService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update match' })
  @ApiOkResponse({ type: Match })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateMatchDto) {
    return this.matchService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete match' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.matchService.remove(id);
    return { deleted: true };
  }
}
