# 🎬 Install FFmpeg

FFmpeg is required for video compression. Here's how to install it on Windows:

## Option 1: Using Chocolatey (Easiest)

If you have Chocolatey installed:

```bash
choco install ffmpeg
```

Then verify:
```bash
ffmpeg -version
```

## Option 2: Download from Official Website

1. Go to https://ffmpeg.org/download.html
2. Click "Windows builds from gyan.dev"
3. Download the full build (recommended)
4. Extract to a folder, e.g., `C:\ffmpeg`
5. Add to PATH:
   - Right-click "This PC" → Properties
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", click "New"
   - Variable name: `PATH`
   - Variable value: `C:\ffmpeg\bin`
   - Click OK

Then verify:
```bash
ffmpeg -version
```

## Option 3: Using Windows Package Manager

```bash
winget install ffmpeg
```

Then verify:
```bash
ffmpeg -version
```

## Option 4: Manual Setup (If PATH doesn't work)

If FFmpeg is installed but not in PATH, update the configuration:

1. Find FFmpeg location:
   - Usually: `C:\ffmpeg\bin\ffmpeg.exe`
   - Or: `C:\Program Files\ffmpeg\bin\ffmpeg.exe`

2. Update `backend/.env`:
   ```
   FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
   FFPROBE_PATH=C:\ffmpeg\bin\ffprobe.exe
   ```

3. Restart the worker:
   ```bash
   npm run worker
   ```

## Verify Installation

After installation, test in terminal:

```bash
ffmpeg -version
ffprobe -version
```

You should see version information for both.

## Troubleshooting

### "ffmpeg is not recognized"
- FFmpeg is not in PATH
- Try Option 4 (manual setup)

### "The system cannot find the path specified"
- Check the path in `backend/.env`
- Make sure the path is correct
- Use forward slashes or double backslashes: `C:\\ffmpeg\\bin\\ffmpeg.exe`

### Still not working?
1. Restart your terminal/IDE
2. Restart the worker: `npm run worker`
3. Try uploading a video again

## Next Steps

After installing FFmpeg:

1. Restart the worker:
   ```bash
   npm run worker
   ```

2. Try uploading a video again

3. Watch it compress!

## System Requirements

- **Disk Space**: At least 500MB for FFmpeg
- **RAM**: 2GB minimum (4GB+ recommended)
- **CPU**: Any modern processor

## Getting Help

If you're still having issues:
1. Check `backend/storage/logs/laravel.log` for errors
2. Verify FFmpeg is in PATH: `ffmpeg -version`
3. Check `backend/.env` has correct paths
4. Restart all services: `npm run dev`
