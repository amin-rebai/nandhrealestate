import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

interface CompressionOptions {
  maxWidth?: number;      // Max width in pixels
  maxHeight?: number;     // Max height in pixels
  videoBitrate?: string;  // e.g., '1000k'
  audioBitrate?: string;  // e.g., '128k'
  fps?: number;           // Frame rate
  crf?: number;           // Constant Rate Factor (0-51, lower = better quality)
}

interface CompressionResult {
  success: boolean;
  originalPath: string;
  compressedPath: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  error?: string;
}

const defaultOptions: CompressionOptions = {
  maxWidth: 1280,         // 720p max width
  maxHeight: 720,         // 720p max height
  videoBitrate: '1000k',  // 1 Mbps
  audioBitrate: '128k',   // 128 kbps
  fps: 30,
  crf: 28,                // Good balance between quality and size
};

/**
 * Compress a video file using FFmpeg
 * @param inputPath - Path to the original video file
 * @param options - Compression options
 * @returns Promise with compression result
 */
export const compressVideo = (
  inputPath: string,
  options: CompressionOptions = {}
): Promise<CompressionResult> => {
  return new Promise((resolve) => {
    const opts = { ...defaultOptions, ...options };
    
    // Generate output filename
    const dir = path.dirname(inputPath);
    const ext = path.extname(inputPath);
    const basename = path.basename(inputPath, ext);
    const outputPath = path.join(dir, `${basename}_compressed.mp4`);
    
    // Get original file size
    const originalSize = fs.statSync(inputPath).size;

    // Check if file needs compression (skip if less than 5MB)
    if (originalSize < 5 * 1024 * 1024) {
      console.log(`Video ${inputPath} is already small (${(originalSize / 1024 / 1024).toFixed(2)}MB), skipping compression`);
      resolve({
        success: true,
        originalPath: inputPath,
        compressedPath: inputPath,
        originalSize,
        compressedSize: originalSize,
        compressionRatio: 1,
      });
      return;
    }

    console.log(`Starting video compression: ${inputPath}`);
    console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);

    ffmpeg(inputPath)
      .outputOptions([
        `-vf scale='min(${opts.maxWidth},iw)':min'(${opts.maxHeight},ih)':force_original_aspect_ratio=decrease`,
        `-c:v libx264`,
        `-preset medium`,
        `-crf ${opts.crf}`,
        `-b:v ${opts.videoBitrate}`,
        `-c:a aac`,
        `-b:a ${opts.audioBitrate}`,
        `-r ${opts.fps}`,
        `-movflags +faststart`, // Enable fast start for web playback
      ])
      .output(outputPath)
      .on('start', (commandLine) => {
        console.log('FFmpeg command:', commandLine);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Compression progress: ${progress.percent.toFixed(1)}%`);
        }
      })
      .on('end', () => {
        const compressedSize = fs.statSync(outputPath).size;
        const compressionRatio = originalSize / compressedSize;
        
        console.log(`Compression complete: ${outputPath}`);
        console.log(`Compressed size: ${(compressedSize / 1024 / 1024).toFixed(2)}MB`);
        console.log(`Compression ratio: ${compressionRatio.toFixed(2)}x`);

        // Delete original file and rename compressed file
        fs.unlinkSync(inputPath);
        fs.renameSync(outputPath, inputPath);

        resolve({
          success: true,
          originalPath: inputPath,
          compressedPath: inputPath,
          originalSize,
          compressedSize,
          compressionRatio,
        });
      })
      .on('error', (err) => {
        console.error('Compression error:', err.message);
        
        // Clean up partial output file if it exists
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }

        resolve({
          success: false,
          originalPath: inputPath,
          compressedPath: inputPath,
          originalSize,
          compressedSize: originalSize,
          compressionRatio: 1,
          error: err.message,
        });
      })
      .run();
  });
};

export default compressVideo;

