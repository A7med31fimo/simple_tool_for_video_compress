const chalk = require('chalk');

const PRESETS = {
  ultrafast: {
    description: 'Fastest encoding, largest file size',
    parameters: {
      preset: 'ultrafast',
      crf: 28,
      ref: 1,
      bframes: 0,
      lookahead: 0
    }
  },
  fast: {
    description: 'Fast encoding, good quality',
    parameters: {
      preset: 'fast',
      crf: 25,
      ref: 2,
      bframes: 2,
      lookahead: 20
    }
  },
  medium: {
    description: 'Balanced speed and quality (default)',
    parameters: {
      preset: 'medium',
      crf: 23,
      ref: 3,
      bframes: 3,
      lookahead: 40
    }
  },
  slow: {
    description: 'Slower encoding, better quality',
    parameters: {
      preset: 'slow',
      crf: 21,
      ref: 4,
      bframes: 4,
      lookahead: 50
    }
  },
  veryslow: {
    description: 'Slowest encoding, best quality',
    parameters: {
      preset: 'veryslow',
      crf: 19,
      ref: 5,
      bframes: 5,
      lookahead: 60
    }
  },
  research: {
    description: 'Research-grade with maximum quality settings',
    parameters: {
      preset: 'veryslow',
      crf: 18,
      profile: 'high',
      level: '5.1',
      ref: 16,
      bframes: 16,
      lookahead: 250,
      aqMode: 3,
      aqStrength: 1.0
    }
  }
};

const execute = () => {
  console.log(chalk.cyan('\n🎬 Available Compression Presets:\n'));

  Object.entries(PRESETS).forEach(([name, preset]) => {
    console.log(chalk.yellow(`${name.toUpperCase()}`));
    console.log(`  ${preset.description}`);
    console.log(chalk.gray('  Parameters:'));
    Object.entries(preset.parameters).forEach(([key, value]) => {
      console.log(chalk.gray(`    ${key}: ${value}`));
    });
    console.log();
  });

  console.log(chalk.cyan('Usage:'));
  console.log('  vidcompress compress input.mp4 -p medium');
  console.log('  vidcompress compress input.mp4 -p research');
  console.log('  vidcompress compress input.mp4 --preset slow --crf 21\n');
};

module.exports = { execute };
