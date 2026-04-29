# Setup Guide

## Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- PHP 8.1+ ([download](https://www.php.net/downloads))
- Composer ([download](https://getcomposer.org/))
- FFmpeg with libx264 ([download](https://ffmpeg.org/download.html))
- Git

## Installation Steps

### 1. Clone Repository

```bash
git clone <repository-url>
cd simple-tool-for-video-compress
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm run install:all
```

Or install individually:

```bash
# CLI dependencies
npm install

# Backend dependencies
cd backend && composer install && cd ..

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Backend Setup

```bash
# Copy environment file
cp backend/.env.example backend/.env

# Generate app key
cd backend && php artisan key:generate && cd ..

# Create SQLite database
touch backend/database/database.sqlite

# Run migrations
npm run backend:migrate
```

### 4. Frontend Setup

```bash
# No additional setup needed, dependencies already installed
```

### 5. Verify FFmpeg Installation

```bash
# Check FFmpeg
ffmpeg -version

# Check FFprobe
ffprobe -version
```

If not found, update paths in `backend/.env`:
```
FFMPEG_PATH=/custom/path/to/ffmpeg
FFPROBE_PATH=/custom/path/to/ffprobe
```

## Running the Application

### Option 1: Run Everything

```bash
npm run dev
```

This starts:
- Laravel backend on `http://localhost:8000`
- React frontend on `http://localhost:5173`

### Option 2: Run Components Separately

**Terminal 1 - Backend:**
```bash
npm run backend:serve
```

**Terminal 2 - Frontend:**
```bash
npm run frontend:dev
```

**Terminal 3 - CLI (optional):**
```bash
npm run cli compress --input video.mp4 --output compressed.mp4
```

## Quick Test

### Test CLI

```bash
# Show help
npm run cli:help

# List presets
npm run cli presets

# Compress a video (requires video file)
npm run cli compress -i input.mp4 -o output.mp4 --preset medium
```

### Test API

```bash
# Create a job
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

# List jobs
curl http://localhost:8000/api/jobs

# Get statistics
curl http://localhost:8000/api/stats/jobs
```

### Test Frontend

Open `http://localhost:5173` in your browser. You should see:
- Header with application title
- Statistics cards (all showing 0 initially)
- Empty jobs table

## Configuration

### Backend Configuration

Edit `backend/.env`:

```env
# Application
APP_NAME="Video Compress"
APP_ENV=local
APP_DEBUG=true

# Database
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# FFmpeg
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe
COMPRESSION_TIMEOUT=3600
MAX_FILE_SIZE=5368709120
```

### Frontend Configuration

Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME="Video Compress"
```

### CLI Configuration

Create `.env` in project root:

```env
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe
API_URL=http://localhost:8000/api
```

## Troubleshooting

### FFmpeg not found

**Windows:**
```bash
# Download FFmpeg from https://ffmpeg.org/download.html
# Add to PATH or specify in .env
FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

### Port already in use

Change ports in `.env` or use:

```bash
# Backend on different port
cd backend && php artisan serve --port=8001

# Frontend on different port
cd frontend && npm run dev -- --port=5174
```

### Database errors

Reset database:

```bash
cd backend
php artisan migrate:reset
php artisan migrate
```

### Node modules issues

Clear and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Permission denied (CLI)

Make CLI executable:

```bash
chmod +x cli/index.js
```

## Next Steps

1. Read [CLI Documentation](./CLI.md) for command usage
2. Read [API Documentation](./API.md) for endpoint details
3. Read [Architecture](./ARCHITECTURE.md) for system design
4. Check [README.md](../README.md) for feature overview

## Development Tips

- Use `npm run cli presets` to see available encoding presets
- Use `npm run cli stats --file video.mp4` to analyze videos
- Check `backend/storage/logs/laravel.log` for backend errors
- Use browser DevTools for frontend debugging
- Use `php artisan tinker` for backend debugging

## Production Deployment

For production deployment, see deployment guides in `docs/` directory.

Key considerations:
- Use MySQL/PostgreSQL instead of SQLite
- Enable HTTPS/SSL
- Set up job queue system
- Configure authentication
- Set up monitoring and logging
- Use environment-specific configurations
