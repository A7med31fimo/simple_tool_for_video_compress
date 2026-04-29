#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const compress = require('./commands/compress');
const stats = require('./commands/stats');
const presets = require('./commands/presets');
const batch = require('./commands/batch');

program
  .name('vidcompress')
  .description('Research-grade video compression tool with H.264/x264 experimentation')
  .version('1.0.0');

program
  .command('compress <input>')
  .description('Compress a video file with customizable H.264 parameters')
  .option('-o, --output <path>', 'Output file path')
  .option('-p, --preset <preset>', 'Compression preset (ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow)', 'medium')
  .option('-crf <value>', 'Quality level (0-51, lower=better, default=23)', '23')
  .option('-b:v <bitrate>', 'Video bitrate (e.g., 1000k, 5M)')
  .option('--profile <profile>', 'H.264 profile (baseline, main, high)', 'high')
  .option('--level <level>', 'H.264 level (4.0, 4.1, 4.2, 5.0, 5.1, 5.2)', '4.1')
  .option('--tune <tune>', 'Tuning (film, animation, grain, stillimage, psnr, ssim, fastdecode, zerolatency)')
  .option('--aq-mode <mode>', 'Adaptive quantization mode (0-3)', '2')
  .option('--aq-strength <strength>', 'AQ strength (0.0-3.0)', '1.0')
  .option('--threads <threads>', 'Number of encoding threads')
  .option('--lookahead <frames>', 'Lookahead frames (0-250)', '40')
  .option('--ref <frames>', 'Reference frames (1-16)', '3')
  .option('--bframes <frames>', 'B-frames (0-16)', '3')
  .option('--json', 'Output results as JSON')
  .action(compress.execute);

program
  .command('stats <input>')
  .description('Analyze video file and show compression statistics')
  .option('--json', 'Output as JSON')
  .action(stats.execute);

program
  .command('presets')
  .description('Show available compression presets and their parameters')
  .action(presets.execute);

program
  .command('batch <directory>')
  .description('Batch compress multiple video files')
  .option('-p, --preset <preset>', 'Compression preset', 'medium')
  .option('-o, --output <directory>', 'Output directory')
  .option('--pattern <pattern>', 'File pattern to match (e.g., *.mp4)', '*.mp4')
  .option('--parallel <count>', 'Number of parallel compressions', '1')
  .action(batch.execute);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
