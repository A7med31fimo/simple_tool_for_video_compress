const ffmpeg = require('fluent-ffmpeg');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const path = require('path');

const buildH264Options = (options) => {
  const h264Options = [];

  if (options.preset) h264Options.push(`preset=${options.preset}`);
  if (options.crf) h264Options.push(`crf=${options.crf}`);
  if (options.profile) h264Options.push(`profile=${options.profile}`);
  if (options.level) h264Options.push(`level=${options.level}`);
  if (options.tune) h264Options.push(`tune=${options.tune}`);
  if (options.aqMode) h264Options.push(`aq-mode=${options.aqMode}`);
  if (options.aqStrength) h264Options.push(`aq-strength=${options.aqStrength}`);
  if (options.threads) h264Options.push(`threads=${options.threads}`);
  if (options.lookahead) h264Options.push(`lookahead=${options.lookahead}`);
  if (options.ref) h264Options.push(`ref=${options.ref}`);
  if (options.bframes) h264Options.push(`bframes=${options.bframes}`);

  return h264Options.join(':');
};

const execute = async (input, options) => {
  if (!fs.existsSync(input)) {
    console.error(chalk.red(`✗ Input file not found: ${input}`));
    process.exit(1);
  }

  const output = options.output || `${path.basename(input, path.extname(input))}_compressed.mp4`;
  const spinner = ora('Initializing compression...').start();

  try {
    const h264Options = buildH264Options(options);

    return new Promise((resolve, reject) => {
      ffmpeg(input)
        .videoCodec('libx264')
        .audioCodec('aac')
        .audioChannels(2)
        .audioFrequency(44100)
        .outputOptions([
          `-x264-params ${h264Options}`,
          options.bitrate ? `-b:v ${options.bitrate}` : ''
        ].filter(Boolean))
        .on('start', (cmd) => {
          spinner.text = `Compressing: ${path.basename(input)}`;
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            spinner.text = `Compressing: ${Math.round(progress.percent)}%`;
          }
        })
        .on('end', () => {
          spinner.succeed(chalk.green(`✓ Compression complete: ${output}`));

          const inputSize = fs.statSync(input).size;
          const outputSize = fs.statSync(output).size;
          const reduction = ((1 - outputSize / inputSize) * 100).toFixed(2);

          const result = {
            input,
            output,
            inputSize: `${(inputSize / 1024 / 1024).toFixed(2)} MB`,
            outputSize: `${(outputSize / 1024 / 1024).toFixed(2)} MB`,
            reduction: `${reduction}%`,
            parameters: {
              preset: options.preset,
              crf: options.crf,
              profile: options.profile,
              level: options.level,
              tune: options.tune || 'none',
              aqMode: options.aqMode,
              aqStrength: options.aqStrength,
              ref: options.ref,
              bframes: options.bframes
            }
          };

          if (options.json) {
            console.log(JSON.stringify(result, null, 2));
          } else {
            console.log(chalk.cyan('\n📊 Compression Results:'));
            console.log(`  Input:  ${result.inputSize}`);
            console.log(`  Output: ${result.outputSize}`);
            console.log(`  Reduction: ${result.reduction}`);
          }

          resolve(result);
        })
        .on('error', (err) => {
          spinner.fail(chalk.red(`✗ Compression failed: ${err.message}`));
          reject(err);
        })
        .save(output);
    });
  } catch (error) {
    spinner.fail(chalk.red(`✗ Error: ${error.message}`));
    process.exit(1);
  }
};

module.exports = { execute };
