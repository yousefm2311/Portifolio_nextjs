import { Schema, models, model, Types } from 'mongoose';
import './Media';

const RoleVariantSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    previewMediaId: { type: Schema.Types.ObjectId, ref: 'Media' }
  },
  { _id: false }
);

const FeatureSchema = new Schema(
  {
    title: { type: String, required: true },
    details: { type: String, required: true }
  },
  { _id: false }
);

const KpiSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const HotspotSchema = new Schema(
  {
    timeStart: { type: Number, required: true },
    timeEnd: { type: Number, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    action: { type: String, required: true },
    label: { type: String, required: true }
  },
  { _id: false }
);

const AppSchema = new Schema(
  {
    title: { type: String, required: true },
    titleEn: { type: String },
    slug: { type: String, required: true, unique: true, index: true },
    shortDesc: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Flutter', 'Backend', 'Admin', 'Tools', 'DevOps'],
      required: true
    },
    tags: [{ type: String }],
    roleVariants: [RoleVariantSchema],
    techStack: [{ type: String }],
    features: [FeatureSchema],
    kpis: [KpiSchema],
    links: {
      liveDemoUrl: String,
      githubUrl: String,
      apkUrl: String,
      iosUrl: String,
      playStoreUrl: String,
      appStoreUrl: String
    },
    demo: {
      type: {
        type: String,
        enum: ['video', 'flutter_web', 'interactive_video'],
        required: true
      },
      embedUrl: String,
      videoId: { type: Schema.Types.ObjectId, ref: 'Media' },
      interactiveHotspots: [HotspotSchema]
    },
    media: {
      iconId: { type: Schema.Types.ObjectId, ref: 'Media' },
      coverId: { type: Schema.Types.ObjectId, ref: 'Media' },
      galleryIds: [{ type: Schema.Types.ObjectId, ref: 'Media' }]
    },
    caseStudy: {
      problem: { type: String, required: true },
      solution: { type: String, required: true },
      architecture: { type: String, required: true },
      challenges: { type: String, required: true },
      results: { type: String, required: true }
    },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

export const App = models.App || model('App', AppSchema);
