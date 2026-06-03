import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditEntity } from '../../common/enums/audit-entity.enum';
import { Match } from '../../modules/match/entities/match.entity';
import { Member } from '../../modules/member/entities/member.entity';
import { Person } from '../../modules/person/entities/person.entity';
import { Staff } from '../../modules/staff/entities/staff.entity';
import { Team } from '../../modules/team/entities/team.entity';
import { Audit } from '../entities/audit.entity';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  async afterInsert(event: InsertEvent<object>): Promise<void> {
    if (!event.entity) {
      return;
    }
    await this.record(event.entity, event.metadata.target, AuditAction.ADD, event.connection);
  }

  async afterUpdate(event: UpdateEvent<object>): Promise<void> {
    if (!event.entity) {
      return;
    }
    await this.record(event.entity, event.metadata.target, AuditAction.UPDATE, event.connection);
  }

  async afterRemove(event: RemoveEvent<object>): Promise<void> {
    if (!event.entity) {
      return;
    }
    await this.record(event.entity, event.metadata.target, AuditAction.DELETE, event.connection);
  }

  private async record(
    entity: object,
    target: Function | string,
    action: AuditAction,
    connection: DataSource,
  ): Promise<void> {
    const auditEntity = this.resolveAuditEntity(target);
    if (!auditEntity) {
      return;
    }

    await connection.manager.getRepository(Audit).save({
      entity: auditEntity,
      action,
      newValue: this.toAuditPayload(entity),
      modifiedAt: new Date(),
    });
  }

  private resolveAuditEntity(target: Function | string): AuditEntity | null {
    if (target === Audit) {
      return null;
    }
    if (target === Team) {
      return AuditEntity.TEAM;
    }
    if (target === Match) {
      return AuditEntity.MATCH;
    }
    if (target === Person || target === Member || target === Staff) {
      return AuditEntity.PERSON;
    }
    return null;
  }

  private toAuditPayload(entity: object): Record<string, unknown> {
    const plain = { ...entity } as Record<string, unknown>;
    for (const key of Object.keys(plain)) {
      if (plain[key] instanceof Date) {
        plain[key] = (plain[key] as Date).toISOString();
      }
    }
    return plain;
  }
}
