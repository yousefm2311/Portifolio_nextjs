import { Schema, models, model } from 'mongoose';
import './Media';

const SiteSettingsSchema = new Schema(
  {
    cvMediaId: { type: Schema.Types.ObjectId, ref: 'Media' },
    cvUrl: { type: String }
  },
  { timestamps: true }
);

export const SiteSettings = models.SiteSettings || model('SiteSettings', SiteSettingsSchema);
