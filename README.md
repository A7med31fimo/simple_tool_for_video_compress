# Simple Tool for Video Compress

A research-grade video compression experimentation tool with CLI, Laravel backend, and React frontend. Powered by FFmpeg and x264 for H.264 encoding.

**Version:** 1.0.0

## Overview

This tool provides a comprehensive platform for video compression research and experimentation. It exposes H.264 encoding controls through:

- **CLI Tool**: Command-line interface for batch processing and scripting
- **Laravel Backend**: RESTful API for compression jobs and parameter management
- **React Frontend**: Interactive UI for real-time compression monitoring and parameter tuning

## Features

- H.264 compression with x264 encoder via FFmpeg
- Configurable encoding parameters (bitrate, quality, preset, profile)
- Real-time compression monitoring and progress tracking
- Batch processing capabilities
- Compression history and analytics
- Research-grade parameter experimentation
- Job queue management

## Project Structure

```
simple-tool-for-video-compress/
├── cli/                    # Node.js CLI tool
│   ├── index.js           # CLI entry point
│   ├── commands/          # Command implementations
│   └── utils/             # Utility functions
├── backend/               # Laravel API server
│   ├── app/               # Application logic
│   ├── routes/            # API routes
│   ├── database/          # Migrations and seeders
│   └── .env.example       # Environment template
├── frontend/              # React application
│   ├── src/               # React components and pages
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── docs/                  # Documentation
└── README.md             # This file
```

## Quick Start

### Prerequisites

- Node.js 18+
- PHP 8.1+
- Composer
- FFmpeg with libx264
- npm or yarn

### Installation

```bash
# Clone and setup
git clone <repository>
cd simple-tool-for-video-compress

# Install all dependencies
npm run install:all
```

### CLI Usage

```bash
# Compress a video
npm run cli compress --input video.mp4 --output compressed.mp4 --bitrate 2000k

# Show help
npm run cli:help

# List available presets
npm run cli presets

# Get compression stats
npm run cli stats --file compressed.mp4
```

### Backend Setup

```bash
# Install dependencies
npm run backend:install

# Setup environment
cp backend/.env.example backend/.env

# Generate app key
cd backend && php artisan key:generate

# Run migrations
npm run backend:migrate

# Start server
npm run backend:serve
```

### Frontend Setup

```bash
# Install dependencies
npm run frontend:install

# Start development server
npm run frontend:dev

# Build for production
npm run frontend:build
```

### Run Everything

```bash
npm run dev
```

This starts:
- Laravel backend on `http://localhost:8000`
- React frontend on `http://localhost:5173`

## CLI Commands

### compress
Compress a video file with specified parameters.

```bash
npm run cli compress \
  --input input.mp4 \
  --output output.mp4 \
  --bitrate 2000k \
  --preset medium \
  --crf 23
```

**Options:**
- `--input, -i`: Input video file (required)
- `--output, -o`: Output video file (required)
- `--bitrate, -b`: Target bitrate (e.g., 2000k, 5M)
- `--preset, -p`: Encoding preset (ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow)
- `--crf, -q`: Quality (0-51, lower is better, default: 23)
- `--profile`: H.264 profile (baseline, main, high)
- `--level`: H.264 level (4.0, 4.1, 4.2, 5.0, 5.1, 5.2)

### presets
List available encoding presets and their characteristics.

```bash
npm run cli presets
```

### stats
Display compression statistics for a video file.

```bash
npm run cli stats --file output.mp4
```

### batch
Process multiple videos from a directory.

```bash
npm run cli batch \
  --input-dir ./videos \
  --output-dir ./compressed \
  --preset fast \
  --bitrate 1500k
```

## API Endpoints

### Jobs
- `POST /api/jobs` - Create compression job
- `GET /api/jobs` - List jobs
- `GET /api/jobs/:id` - Get job details
- `DELETE /api/jobs/:id` - Cancel job

### Presets
- `GET /api/presets` - List encoding presets
- `POST /api/presets` - Create custom preset

### Stats
- `GET /api/stats/jobs` - Job statistics
- `GET /api/stats/compression` - Compression metrics

## H.264 Encoding Parameters

### Preset (Speed vs Quality)
- **ultrafast**: Fastest encoding, lowest quality
- **fast**: Good balance for real-time
- **medium**: Default, good quality
- **slow**: Better quality, slower encoding
- **veryslow**: Best quality, very slow

### Quality (CRF)
- Range: 0-51 (lower = better quality)
- Default: 23
- Recommended: 18-28 for most use cases

### Bitrate
- Constant bitrate (CBR): Fixed output size
- Variable bitrate (VBR): Better quality at lower file sizes
- Two-pass encoding: Optimal quality/size ratio

### Profile & Level
- **Baseline**: Maximum compatibility
- **Main**: Better compression, good compatibility
- **High**: Best compression, limited compatibility

## Configuration

### Environment Variables

Create `.env` files in backend and frontend directories:

**backend/.env:**
```
APP_NAME="Video Compress"
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=sqlite
FFMPEG_PATH=/usr/bin/ffmpeg
COMPRESSION_TIMEOUT=3600
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME="Video Compress"
```

## Development

### Adding New Encoding Presets

Edit `backend/app/Models/Preset.php` and add to the presets array.

### Extending CLI Commands

Create new command files in `cli/commands/` and register in `cli/index.js`.

### Frontend Components

React components are in `frontend/src/components/`. Use the provided hooks for API communication.

## Performance Considerations

- FFmpeg encoding is CPU-intensive; consider job queuing for multiple files
- Use appropriate presets based on your speed/quality requirements
- Two-pass encoding provides better quality but takes 2x longer
- Monitor system resources during batch processing

## Troubleshooting

### FFmpeg not found
Ensure FFmpeg is installed and in your PATH:
```bash
ffmpeg -version
```

### Database errors
Reset migrations:
```bash
cd backend && php artisan migrate:reset && php artisan migrate
```

### Port conflicts
Change ports in `.env` files or use:
```bash
cd backend && php artisan serve --port=8001
cd frontend && npm run dev -- --port=5174
```

## License

MIT

## Contributing

Contributions welcome. Please ensure code follows project conventions and includes tests.

## Support

For issues and questions, please open an issue on the repository.
