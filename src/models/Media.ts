import { Schema, models, model } from 'mongoose';

export type MediaType = 'image' | 'video' | 'file';
export type MediaProvider = 'cloudinary' | 's3' | 'r2';

export interface MediaDoc {
  _id: string;
  type: MediaType;
  provider: MediaProvider;
  providerId?: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  size: number;
  alt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<MediaDoc>(
  {
    type: { type: String, enum: ['image', 'video', 'file'], required: true },
    provider: { type: String, enum: ['cloudinary', 's3', 'r2'], required: true },
    providerId: { type: String },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    width: { type: Number },
    height: { type: Number },
    duration: { type: Number },
    size: { type: Number, required: true },
    alt: { type: String }
  },
  { timestamps: true }
);

export const Media = models.Media || model<MediaDoc>('Media', MediaSchema);
