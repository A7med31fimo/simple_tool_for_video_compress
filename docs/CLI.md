# CLI Documentation

## Overview

The CLI tool provides command-line access to video compression with full control over H.264 encoding parameters.

## Installation

```bash
npm install
npm link  # Make 'vidcompress' available globally
```

## Commands

### compress

Compress a single video file with customizable H.264 parameters.

```bash
vidcompress compress input.mp4 -o output.mp4 --preset medium --crf 23
```

**Options:**
- `-o, --output <path>` - Output file path
- `-p, --preset <preset>` - Compression preset (ultrafast, fast, medium, slow, veryslow)
- `-crf <value>` - Quality level (0-51, lower=better, default=23)
- `-b:v <bitrate>` - Video bitrate (e.g., 1000k, 5M)
- `--profile <profile>` - H.264 profile (baseline, main, high)
- `--level <level>` - H.264 level (4.0-5.2)
- `--tune <tune>` - Tuning (film, animation, grain, stillimage, psnr, ssim, fastdecode, zerolatency)
- `--aq-mode <mode>` - Adaptive quantization mode (0-3)
- `--aq-strength <strength>` - AQ strength (0.0-3.0)
- `--threads <threads>` - Number of encoding threads
- `--lookahead <frames>` - Lookahead frames (0-250)
- `--ref <frames>` - Reference frames (1-16)
- `--bframes <frames>` - B-frames (0-16)
- `--json` - Output results as JSON

**Examples:**

```bash
# Basic compression
vidcompress compress video.mp4 -o compressed.mp4

# High quality
vidcompress compress video.mp4 -o hq.mp4 --preset slow --crf 18

# Research-grade
vidcompress compress video.mp4 -o research.mp4 --preset veryslow --crf 18 --ref 16 --bframes 16 --lookahead 250

# Bitrate-limited
vidcompress compress video.mp4 -o limited.mp4 -b:v 2000k

# Fast encoding
vidcompress compress video.mp4 -o fast.mp4 --preset ultrafast --crf 28
```

### stats

Analyze a video file and display compression statistics.

```bash
vidcompress stats input.mp4
```

**Options:**
- `--json` - Output as JSON

**Output includes:**
- File size and duration
- Video codec, resolution, FPS, bitrate
- Audio codec, channels, sample rate, bitrate

### presets

List available compression presets and their parameters.

```bash
vidcompress presets
```

Shows all available presets with their recommended parameters and use cases.

### batch

Process multiple video files from a directory.

```bash
vidcompress batch ./videos -o ./compressed --preset medium
```

**Options:**
- `-o, --output <directory>` - Output directory
- `-p, --preset <preset>` - Compression preset
- `--pattern <pattern>` - File pattern to match (default: *.mp4)
- `--parallel <count>` - Number of parallel compressions (default: 1)

## H.264 Parameters Guide

### Preset (Speed vs Quality)
- **ultrafast**: Fastest, lowest quality, largest file
- **fast**: Good balance for real-time
- **medium**: Default, good quality
- **slow**: Better quality, slower
- **veryslow**: Best quality, very slow

### Quality (CRF)
- 0-18: Visually lossless to very high quality
- 18-28: High quality (recommended)
- 28-51: Lower quality, smaller files
- Default: 23

### Profiles
- **baseline**: Maximum compatibility, lowest compression
- **main**: Good compatibility, better compression (recommended)
- **high**: Best compression, limited compatibility

### Levels
- 4.0, 4.1, 4.2: HD and lower
- 5.0, 5.1, 5.2: 4K and higher

## Advanced Usage

### Two-Pass Encoding

For optimal quality-to-size ratio, use two-pass encoding (not yet implemented in CLI, but available via API).

### Adaptive Quantization

Control quality distribution across the video:
- `--aq-mode 0`: Disabled
- `--aq-mode 1`: Variance AQ
- `--aq-mode 2`: Auto-variance AQ (default)
- `--aq-mode 3`: Auto-variance AQ with bias to dark scenes

### Reference Frames

More reference frames = better quality but slower encoding:
- 1-2: Fast encoding
- 3-4: Balanced (default)
- 5+: High quality

### B-Frames

Bidirectional frames improve compression:
- 0: Disabled
- 1-3: Balanced (default)
- 4+: Maximum compression

## Performance Tips

1. Use appropriate presets based on your speed/quality needs
2. Adjust CRF instead of bitrate for better quality control
3. Use lookahead for better quality (slower)
4. Reduce reference frames for faster encoding
5. Monitor CPU usage during encoding

## Troubleshooting

### FFmpeg not found
Ensure FFmpeg is installed and in your PATH:
```bash
ffmpeg -version
```

### Out of memory
Reduce lookahead or reference frames:
```bash
vidcompress compress video.mp4 -o out.mp4 --lookahead 20 --ref 2
```

### Slow encoding
Use a faster preset:
```bash
vidcompress compress video.mp4 -o out.mp4 --preset fast
```
