import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Match } from '../match/entities/match.entity';
import { Member } from '../member/entities/member.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamMemberQueryDto } from './dto/team-member-query.dto';
import { UpdateTeamStatusDto } from './dto/update-team-status.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { TeamService } from './team.service';

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Post()
  @ApiOperation({ summary: 'Create a team' })
  @ApiCreatedResponse({ type: Team })
  create(@Body() payload: CreateTeamDto) {
    return this.teamService.create(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({ type: Team })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamService.findById(id);
  }

  @Get(':id/matches')
  @ApiOperation({ summary: 'Get all matches for team' })
  @ApiOkResponse({ type: [Match] })
  findMatches(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamService.getMatches(id);
  }

  @Get(':id/member')
  @ApiOperation({ summary: 'Get members for team (optional status + role)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiOkResponse({ type: [Member] })
  findMembers(@Param('id', ParseUUIDPipe) id: string, @Query() query: TeamMemberQueryDto) {
    return this.teamService.getMembers(id, query);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get team stats' })
  @ApiOkResponse({
    schema: { example: { win: 0, loss: 0, players: 0, matches: 0 } },
  })
  findStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamService.getStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update team' })
  @ApiOkResponse({ type: Team })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateTeamDto) {
    return this.teamService.update(id, payload);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update team status' })
  @ApiOkResponse({ type: Team })
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateTeamStatusDto) {
    return this.teamService.updateStatus(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete team' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.teamService.remove(id);
    return { deleted: true };
  }
}
