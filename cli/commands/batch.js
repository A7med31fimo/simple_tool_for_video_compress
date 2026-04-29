const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const compress = require('./compress');

const execute = async (directory, options) => {
  if (!fs.existsSync(directory)) {
    console.error(chalk.red(`✗ Directory not found: ${directory}`));
    process.exit(1);
  }

  const pattern = path.join(directory, options.pattern || '*.mp4');
  const files = glob.sync(pattern);

  if (files.length === 0) {
    console.log(chalk.yellow(`⚠ No files matching pattern: ${options.pattern}`));
    return;
  }

  console.log(chalk.cyan(`\n📦 Found ${files.length} file(s) to compress\n`));

  const outputDir = options.output || directory;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results = [];
  const parallel = parseInt(options.parallel) || 1;

  for (let i = 0; i < files.length; i += parallel) {
    const batch = files.slice(i, i + parallel);
    const promises = batch.map(file => {
      const output = path.join(outputDir, `${path.basename(file, path.extname(file))}_compressed.mp4`);
      return compress.execute(file, {
        output,
        preset: options.preset,
        json: true
      }).catch(err => ({ error: err.message, file }));
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  console.log(chalk.cyan('\n📊 Batch Compression Summary:'));
  console.log(`  Total files: ${files.length}`);
  console.log(`  Successful: ${results.filter(r => !r.error).length}`);
  console.log(`  Failed: ${results.filter(r => r.error).length}\n`);
};

module.exports = { execute };
