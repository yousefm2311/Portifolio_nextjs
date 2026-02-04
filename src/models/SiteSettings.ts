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
            label: { type: String },
            _id: false
          }
        ],
        default: []
      },
      en: {
        type: [
          {
            value: { type: String },
            label: { type: String },
            _id: false
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
            desc: { type: String },
            _id: false
          }
        ],
        default: []
      },
      en: {
        type: [
          {
            year: { type: String },
            title: { type: String },
            desc: { type: String },
            _id: false
          }
        ],
        default: []
      }
    },
    capabilitiesIntro: {
      ar: {
        eyebrow: { type: String, default: '' },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' }
      },
      en: {
        eyebrow: { type: String, default: '' },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' }
      }
    },
    capabilitiesNotes: {
      ar: {
        noteA: { type: String, default: '' },
        noteB: { type: String, default: '' }
      },
      en: {
        noteA: { type: String, default: '' },
        noteB: { type: String, default: '' }
      }
    },
    capabilitiesItems: {
      ar: {
        type: [
          {
            title: { type: String },
            desc: { type: String },
            icon: { type: String },
            mediaId: { type: Schema.Types.ObjectId, ref: 'Media' },
            _id: false
          }
        ],
        default: []
      },
      en: {
        type: [
          {
            title: { type: String },
            desc: { type: String },
            icon: { type: String },
            mediaId: { type: Schema.Types.ObjectId, ref: 'Media' },
            _id: false
          }
        ],
        default: []
      }
    },
    processIntro: {
      ar: {
        eyebrow: { type: String, default: '' },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' }
      },
      en: {
        eyebrow: { type: String, default: '' },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' }
      }
    },
    processSteps: {
      ar: {
        type: [
          {
            title: { type: String },
            desc: { type: String },
            icon: { type: String },
            mediaId: { type: Schema.Types.ObjectId, ref: 'Media' },
            _id: false
          }
        ],
        default: []
      },
      en: {
        type: [
          {
            title: { type: String },
            desc: { type: String },
            icon: { type: String },
            mediaId: { type: Schema.Types.ObjectId, ref: 'Media' },
            _id: false
          }
        ],
        default: []
      }
    },
    cta: {
      ar: {
        eyebrow: { type: String, default: '' },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        primaryLabel: { type: String, default: '' },
        secondaryLabel: { type: String, default: '' }
      },
      en: {
        eyebrow: { type: String, default: '' },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        primaryLabel: { type: String, default: '' },
        secondaryLabel: { type: String, default: '' }
      }
    },
    enableResources: { type: Boolean, default: false },
    enableServices: { type: Boolean, default: false },
    enableCaseStudy: { type: Boolean, default: false },
    resources: {
      ar: {
        type: [
          {
            title: { type: String },
            desc: { type: String },
            url: { type: String },
            type: { type: String },
            badge: { type: String },
            _id: false
          }
        ],
        default: []
      },
      en: {
        type: [
          {
            title: { type: String },
            desc: { type: String },
            url: { type: String },
            type: { type: String },
            badge: { type: String },
            _id: false
          }
        ],
        default: []
      }
    },
    services: {
      ar: {
        type: [
          {
            name: { type: String },
            price: { type: String },
            description: { type: String },
            features: { type: [String], default: [] },
            highlight: { type: Boolean, default: false },
            _id: false
          }
        ],
        default: []
      },
      en: {
        type: [
          {
            name: { type: String },
            price: { type: String },
            description: { type: String },
            features: { type: [String], default: [] },
            highlight: { type: Boolean, default: false },
            _id: false
          }
        ],
        default: []
      }
    }
  },
  { timestamps: true }
);

export const SiteSettings = models.SiteSettings || model('SiteSettings', SiteSettingsSchema);
