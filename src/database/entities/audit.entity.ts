import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditEntity } from '../../common/enums/audit-entity.enum';

@Entity('audit')
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: AuditEntity })
  entity!: AuditEntity;

  @Column({ type: 'enum', enum: AuditAction })
  action!: AuditAction;

  @Column({ name: 'new_value', type: 'jsonb' })
  newValue!: Record<string, unknown>;

  @Column({ name: 'modified_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  modifiedAt!: Date;
}
