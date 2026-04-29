const ffmpeg = require('fluent-ffmpeg');
const chalk = require('chalk');
const fs = require('fs');

const execute = async (input, options) => {
  if (!fs.existsSync(input)) {
    console.error(chalk.red(`✗ Input file not found: ${input}`));
    process.exit(1);
  }

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(input, (err, metadata) => {
      if (err) {
        console.error(chalk.red(`✗ Error reading file: ${err.message}`));
        reject(err);
        return;
      }

      const fileSize = fs.statSync(input).size;
      const duration = metadata.format.duration;
      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      const audioStream = metadata.streams.find(s => s.codec_type === 'audio');

      const stats = {
        file: input,
        fileSize: `${(fileSize / 1024 / 1024).toFixed(2)} MB`,
        duration: `${Math.floor(duration / 60)}m ${Math.floor(duration % 60)}s`,
        bitrate: `${(metadata.format.bit_rate / 1000).toFixed(0)} kbps`,
        video: videoStream ? {
          codec: videoStream.codec_name,
          resolution: `${videoStream.width}x${videoStream.height}`,
          fps: eval(videoStream.r_frame_rate),
          bitrate: `${(videoStream.bit_rate / 1000).toFixed(0)} kbps`
        } : null,
        audio: audioStream ? {
          codec: audioStream.codec_name,
          channels: audioStream.channels,
          sampleRate: `${audioStream.sample_rate / 1000} kHz`,
          bitrate: `${(audioStream.bit_rate / 1000).toFixed(0)} kbps`
        } : null
      };

      if (options.json) {
        console.log(JSON.stringify(stats, null, 2));
      } else {
        console.log(chalk.cyan('\n📹 Video Statistics:'));
        console.log(`  File: ${stats.file}`);
        console.log(`  Size: ${stats.fileSize}`);
        console.log(`  Duration: ${stats.duration}`);
        console.log(`  Bitrate: ${stats.bitrate}`);

        if (stats.video) {
          console.log(chalk.cyan('\n  Video Stream:'));
          console.log(`    Codec: ${stats.video.codec}`);
          console.log(`    Resolution: ${stats.video.resolution}`);
          console.log(`    FPS: ${stats.video.fps}`);
          console.log(`    Bitrate: ${stats.video.bitrate}`);
        }

        if (stats.audio) {
          console.log(chalk.cyan('\n  Audio Stream:'));
          console.log(`    Codec: ${stats.audio.codec}`);
          console.log(`    Channels: ${stats.audio.channels}`);
          console.log(`    Sample Rate: ${stats.audio.sampleRate}`);
          console.log(`    Bitrate: ${stats.audio.bitrate}`);
        }
      }

      resolve(stats);
    });
  });
};

module.exports = { execute };
