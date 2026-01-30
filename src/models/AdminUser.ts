import { Schema, models, model } from 'mongoose';

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    role: { type: String, enum: ['admin'], default: 'admin' }
  },
  { timestamps: true }
);

export const AdminUser = models.AdminUser || model('AdminUser', AdminUserSchema);
