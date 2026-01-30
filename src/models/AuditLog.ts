import { Schema, models, model } from 'mongoose';

const AuditLogSchema = new Schema(
  {
    action: { type: String, enum: ['create', 'update', 'delete', 'publish'], required: true },
    entity: { type: String, enum: ['app', 'media'], required: true },
    entityId: { type: String, required: true },
    byEmail: { type: String, required: true },
    meta: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const AuditLog = models.AuditLog || model('AuditLog', AuditLogSchema);
