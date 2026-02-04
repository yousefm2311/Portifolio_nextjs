import { Schema, models, model } from 'mongoose';
import './Media';

const SiteSettingsSchema = new Schema(
  {
    cvMediaId: { type: Schema.Types.ObjectId, ref: 'Media' },
    cvUrl: { type: String },
    heroBadges: {
      ar: { type: [String], default: [] },
      en: { type: [String], default: [] }
    },
    impactItems: {
      ar: {
        type: [
          {
            value: { type: String },
            label: { type: String }
          }
        ],
        default: []
      },
      en: {
        type: [
          {
            value: { type: String },
            label: { type: String }
          }
        ],
        default: []
      }
    },
    techMarquee: {
      ar: { type: [String], default: [] },
      en: { type: [String], default: [] }
    },
    timeline: {
      ar: {
        type: [
          {
            year: { type: String },
            title: { type: String },
            desc: { type: String }
          }
        ],
        default: []
      },
      en: {
        type: [
          {
            year: { type: String },
            title: { type: String },
            desc: { type: String }
          }
        ],
        default: []
      }
    }
  },
  { timestamps: true }
);

export const SiteSettings = models.SiteSettings || model('SiteSettings', SiteSettingsSchema);
