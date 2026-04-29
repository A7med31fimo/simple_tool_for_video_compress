# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Setup Backend
```bash
cp backend/.env.example backend/.env
cd backend && php artisan key:generate && cd ..
touch backend/database/database.sqlite
npm run backend:migrate
```

### 3. Start Everything
```bash
npm run dev
```

This starts:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

## First Compression

### Via CLI
```bash
npm run cli compress -i input.mp4 -o output.mp4 --preset medium
```

### Via API
```bash
curl -X POST http://localhost:8000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "input_file": "video.mp4",
    "output_file": "compressed.mp4",
    "preset": "medium",
    "crf": 23,
    "profile": "main",
    "level": "4.1"
  }'
```

### Via Frontend
1. Open http://localhost:5173
2. Use CLI or API to create jobs
3. Monitor progress in real-time

## Available Commands

```bash
# Show CLI help
npm run cli:help

# List encoding presets
npm run cli presets

# Analyze video
npm run cli stats --file video.mp4

# Batch process
npm run cli batch -i ./videos -o ./compressed --preset fast

# Start backend only
npm run backend:serve

# Start frontend only
npm run frontend:dev
```

## Key Features

✅ **CLI Tool** - Command-line video compression with full H.264 control
✅ **REST API** - Job management and monitoring
✅ **Web UI** - Real-time dashboard and statistics
✅ **Research-Grade** - Extensive encoding parameters for experimentation
✅ **Batch Processing** - Process multiple videos in parallel
✅ **Statistics** - Detailed video analysis and compression metrics

## Documentation

- [Setup Guide](./docs/SETUP.md) - Detailed installation
- [CLI Documentation](./docs/CLI.md) - Command reference
- [API Documentation](./docs/API.md) - Endpoint reference
- [Architecture](./docs/ARCHITECTURE.md) - System design
- [README](./README.md) - Full feature overview

## Troubleshooting

**FFmpeg not found?**
```bash
# Install FFmpeg
# Windows: Download from https://ffmpeg.org/download.html
# macOS: brew install ffmpeg
# Linux: sudo apt-get install ffmpeg
```

**Port already in use?**
```bash
# Change port in backend/.env or use:
cd backend && php artisan serve --port=8001
```

**Database error?**
```bash
cd backend && php artisan migrate:reset && php artisan migrate
```

## Next Steps

1. Read [CLI Documentation](./docs/CLI.md) for advanced usage
2. Explore encoding presets: `npm run cli presets`
3. Try batch processing: `npm run cli batch --help`
4. Check API endpoints: [API Documentation](./docs/API.md)
5. Review architecture: [Architecture Guide](./docs/ARCHITECTURE.md)

## Support

For issues and questions:
1. Check [SETUP.md](./docs/SETUP.md) troubleshooting section
2. Review [Architecture.md](./docs/ARCHITECTURE.md) for system design
3. Check backend logs: `backend/storage/logs/laravel.log`
4. Use browser DevTools for frontend debugging
