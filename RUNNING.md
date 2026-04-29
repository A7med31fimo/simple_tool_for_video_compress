# How to Run the Complete System

Your video compression tool now has a **background job processor** that automatically handles compression jobs. Here's how to run everything:

## 🚀 Quick Start (All-in-One)

### Option 1: Run Everything Together (Recommended)

```bash
npm run dev
```

This starts:
- ✅ Backend API (http://localhost:8000)
- ✅ Frontend UI (http://localhost:5173)
- ✅ Job Worker (processes compression jobs)

All three run in parallel with real-time updates.

### Option 2: Run Components Separately

**Terminal 1 - Backend:**
```bash
npm run backend:serve
```

**Terminal 2 - Frontend:**
```bash
npm run frontend:dev
```

**Terminal 3 - Worker (NEW!):**
```bash
npm run worker
```

Or use the provided scripts:
- **Windows:** `worker.bat`
- **Linux/macOS:** `bash worker.sh`

## 📋 What Each Component Does

### Backend (`npm run backend:serve`)
- Runs Laravel API on http://localhost:8000
- Stores compression jobs in database
- Provides REST endpoints

### Frontend (`npm run frontend:dev`)
- Runs React UI on http://localhost:5173
- Upload videos and configure parameters
- Monitor jobs in real-time

### Worker (`npm run worker`)
- **NEW!** Processes pending compression jobs
- Watches for new jobs every 2 seconds
- Automatically updates job status
- Handles FFmpeg encoding

## 🎯 Complete Workflow

1. **Start everything:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:5173
   ```

3. **Upload a video:**
   - Click "Select Video File"
   - Choose compression settings
   - Click "Start Compression"

4. **Watch it process:**
   - Job appears as "PENDING"
   - Worker picks it up
   - Status changes to "PROCESSING"
   - Progress bar updates
   - Status changes to "COMPLETED"
   - Results show compression percentage

## 🔧 Troubleshooting

### Jobs stuck on "PENDING"?
- Make sure worker is running: `npm run worker`
- Check worker terminal for errors
- Verify FFmpeg is installed: `ffmpeg -version`

### Worker not starting?
```bash
# Check if Laravel command exists
cd backend && php artisan list | grep compression

# If not found, run:
cd backend && php artisan compression:process --watch
```

### FFmpeg not found?
```bash
# Windows: Download from https://ffmpeg.org/download.html
# macOS: brew install ffmpeg
# Linux: sudo apt-get install ffmpeg

# Then update backend/.env:
FFMPEG_PATH=/path/to/ffmpeg
```

### Port already in use?
```bash
# Change backend port
npm run backend:serve -- --port=8001

# Change frontend port
cd frontend && npm run dev -- --port=5174
```

## 📊 Monitoring

### Check Worker Status
Look at the worker terminal - you'll see:
```
🎬 Video Compression Worker Started
Watching for pending jobs...

[2024-01-15 10:30:45] Found 1 pending job(s)
  Processing job #1: video.mp4
  ✓ Job #1 completed! Reduction: 45.2%
```

### Check Frontend
- Statistics update every 3 seconds
- Job cards show real-time progress
- Status badges change as jobs process

### Check Backend Logs
```bash
cd backend
tail -f storage/logs/laravel.log
```

## 🎬 Example: Complete Workflow

### Terminal 1 - Start Everything
```bash
npm run dev
```

Output:
```
> npm run dev

> backend:serve
> cd backend && php artisan serve

Starting Laravel development server: http://127.0.0.1:8000

> frontend:dev
> cd frontend && npm run dev

  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/

> worker
> cd backend && php artisan compression:process --watch

🎬 Video Compression Worker Started
Watching for pending jobs...
```

### Browser - Upload Video
1. Open http://localhost:5173
2. Select a video file
3. Choose preset: "medium"
4. Click "Start Compression"

### Terminal 1 - See Processing
```
[2024-01-15 10:30:45] Found 1 pending job(s)
  Processing job #1: video.mp4
  ✓ Job #1 completed! Reduction: 45.2%
```

### Browser - See Results
- Job status changes: PENDING → PROCESSING → COMPLETED
- Progress bar fills to 100%
- Shows compression percentage

## 📝 Important Notes

1. **Worker must be running** for jobs to process
2. **FFmpeg must be installed** for compression to work
3. **Input files must exist** in the current directory or use full paths
4. **Output files** are created in the current directory
5. **Database** is SQLite by default (backend/database/database.sqlite)

## 🚀 Production Setup

For production, you'd typically:
1. Use a job queue (Redis, RabbitMQ)
2. Run worker as a service/daemon
3. Use MySQL/PostgreSQL instead of SQLite
4. Deploy frontend separately
5. Use proper logging and monitoring

But for development/testing, `npm run dev` is perfect!

## 💡 Tips

- **Batch processing:** Create multiple jobs one after another
- **Monitor multiple:** Watch several jobs compress simultaneously
- **Experiment:** Try different presets to find your balance
- **Check logs:** Worker terminal shows detailed progress

## 🎉 You're All Set!

Your video compression tool is now fully functional with:
- ✅ Web UI for easy uploads
- ✅ Real-time job monitoring
- ✅ Automatic background processing
- ✅ Full H.264 parameter control
- ✅ Compression statistics

Enjoy! 🎬
