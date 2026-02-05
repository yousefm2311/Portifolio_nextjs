import fs from 'fs/promises';
import path from 'path';
import os from 'os';

type FfmpegModule = typeof import('fluent-ffmpeg');

async function getFfmpeg(): Promise<FfmpegModule | null> {
  try {
    const req = eval('require') as NodeRequire;
    const ffmpeg = req('fluent-ffmpeg') as FfmpegModule;
    const ffmpegInstaller = req('@ffmpeg-installer/ffmpeg') as { path: string };
    const ffprobeInstaller = req('@ffprobe-installer/ffprobe') as { path: string };
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
    return ffmpeg;
  } catch {
    return null;
  }
}

type ProbeInfo = {
  hasVideo: boolean;
  videoCodec?: string;
  audioCodec?: string;
  container?: string;
};

async function probeVideo(filePath: string): Promise<ProbeInfo> {
  const ffmpeg = await getFfmpeg();
  if (!ffmpeg) {
    return { hasVideo: true };
  }
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err: Error | null, data: any) => {
      if (err) return reject(err);
      const videoStream = data.streams.find((s: any) => s.codec_type === 'video');
      const audioStream = data.streams.find((s: any) => s.codec_type === 'audio');
      resolve({
        hasVideo: Boolean(videoStream),
        videoCodec: videoStream?.codec_name,
        audioCodec: audioStream?.codec_name,
        container: data.format?.format_name
      });
    });
  });
}

async function writeTempFile(buffer: Buffer, ext: string) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'portfolio-'));
  const inputPath = path.join(dir, `input.${ext}`);
  await fs.writeFile(inputPath, buffer);
  return { dir, inputPath };
}

async function cleanupTemp(dir: string) {
  await fs.rm(dir, { recursive: true, force: true });
}

export async function ensureMp4H264(buffer: Buffer, originalName?: string) {
  const ffmpeg = await getFfmpeg();
  if (!ffmpeg) {
    throw new Error('Video conversion engine is not available');
  }

  const ext = (originalName?.split('.').pop() ?? 'mp4').toLowerCase();
  const { dir, inputPath } = await writeTempFile(buffer, ext);
  const outputPath = path.join(dir, 'output.mp4');

  try {
    const info = await probeVideo(inputPath);
    const alreadyOk =
      info.hasVideo &&
      info.videoCodec === 'h264' &&
      (!info.audioCodec || info.audioCodec === 'aac') &&
      (info.container?.includes('mp4') ?? false);

    if (alreadyOk) {
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions(['-c copy', '-movflags +faststart'])
          .on('end', () => resolve())
          .on('error', (err: Error) => reject(err))
          .save(outputPath);
      });
    } else {
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions([
            '-c:v libx264',
            '-profile:v high',
            '-level 4.1',
            '-pix_fmt yuv420p',
            '-c:a aac',
            '-b:a 128k',
            '-movflags +faststart'
          ])
          .on('end', () => resolve())
          .on('error', (err: Error) => reject(err))
          .save(outputPath);
      });
    }

    const converted = await fs.readFile(outputPath);
    return {
      buffer: converted,
      contentType: 'video/mp4',
      filename: 'video.mp4'
    };
  } finally {
    await cleanupTemp(dir);
  }
}
