# 🎬 Worker Guide - Running the Job Processor

The worker is the background process that automatically compresses videos. Here's how to run it:

## ✅ Quick Start

### Option 1: Run Everything Together (Recommended)

```bash
npm run dev
```

This starts:
- Backend API
- Frontend UI
- **Worker** (automatically processes jobs)

### Option 2: Run Worker Separately

```bash
npm run worker
```

You should see:
```
🎬 Video Compression Worker Started
Watching for pending jobs..
```

## 🔍 What the Worker Does

1. **Monitors** for pending compression jobs every 2 seconds
2. **Picks up** the oldest pending job
3. **Runs FFmpeg** with H.264 compression
4. **Updates** job status in real-time
5. **Stores** compression results (file sizes, reduction %)
6. **Handles errors** gracefully

## 📋 Worker Workflow

```
Worker starts
    ↓
Checks for pending jobs every 2 seconds
    ↓
Found pending job?
    ├─ YES → Run FFmpeg compression
    │         Update status: processing
    │         Wait for completion
    │         Update status: completed
    │         Store results
    │
    └─ NO → Wait 2 seconds, check again
```

## 🚀 Running the Worker

### In Terminal

```bash
# From project root
npm run worker

# Or directly
cd backend && php artisan compression:process --watch
```

### With npm run dev (All Services)

```bash
npm run dev
```

This runs in parallel:
- `npm run backend:serve` (API)
- `npm run frontend:dev` (UI)
- `npm run worker` (Job processor)

## 📊 Monitoring the Worker

### Watch Worker Output

The worker terminal shows:
```
🎬 Video Compression Worker Started
Watching for pending jobs..

[2024-01-15 10:30:45] Found 1 pending job(s)
  Processing job #1: video.mp4
  ✓ Job #1 completed! Reduction: 45.2%
```

### Check Job Status

1. Open http://localhost:5173
2. Look at job cards
3. Status updates every 3 seconds

### Check Logs

```bash
cd backend
tail -f storage/logs/laravel.log
```

## 🛠️ Troubleshooting

### Worker Not Starting

**Error: "Command not found"**
```bash
# Make sure you're in the right directory
cd backend
php artisan compression:process --watch
```

**Error: "Class not found"**
```bash
# Regenerate autoloader
cd backend
composer dump-autoload
```

### Worker Stuck

**Jobs not processing?**
1. Check if worker is running
2. Check if FFmpeg is installed: `ffmpeg -version`
3. Check logs: `backend/storage/logs/laravel.log`

**Worker crashes?**
1. Check error message in terminal
2. Check logs for details
3. Restart: `npm run worker`

### FFmpeg Not Found

```bash
# Install FFmpeg
choco install ffmpeg

# Or update backend/.env
FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
```

## 🎯 Complete Workflow

1. **Start everything:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:5173
   ```

3. **Upload video:**
   - Select file
   - Configure settings
   - Click "Start Compression"

4. **Watch worker process it:**
   - Check worker terminal
   - See status updates
   - Watch progress bar

5. **View results:**
   - Compression percentage
   - File sizes
   - Time taken

## 📝 Worker Configuration

Edit `backend/.env`:

```env
# FFmpeg path
FFMPEG_PATH=ffmpeg
FFPROBE_PATH=ffprobe

# Timeout (seconds)
COMPRESSION_TIMEOUT=3600

# Storage location
COMPRESSION_STORAGE=storage/videos
```

## ✨ Features

✅ Automatic job detection
✅ Real-time progress updates
✅ Error handling and reporting
✅ Compression statistics
✅ Continuous monitoring
✅ Clean shutdown

## 🎬 Example Session

### Terminal 1 - Start Everything
```bash
$ npm run dev

> backend:serve
Starting Laravel development server: http://127.0.0.1:8000

> frontend:dev
  VITE v5.0.0  ready in 234 ms
  ➜  Local:   http://localhost:5173/

> worker
🎬 Video Compression Worker Started
Watching for pending jobs..
```

### Browser - Upload Video
1. Open http://localhost:5173
2. Upload `video.mp4`
3. Click "Start Compression"

### Terminal 1 - See Processing
```
[2024-01-15 10:30:45] Found 1 pending job(s)
  Processing job #1: video.mp4
  ✓ Job #1 completed! Reduction: 45.2%
```

### Browser - See Results
- Status: COMPLETED
- Reduction: 45.2%
- Input: 150MB
- Output: 82MB

## 💡 Tips

- **Multiple jobs:** Create several jobs, worker processes them one by one
- **Monitor progress:** Check worker terminal for real-time updates
- **Check logs:** `backend/storage/logs/laravel.log` for detailed info
- **Restart:** Just run `npm run worker` again if needed

## 🚀 Next Steps

1. Install FFmpeg (if not done)
2. Run `npm run dev`
3. Upload a video
4. Watch it compress!

Your H.264 research tool is ready! 🎬
