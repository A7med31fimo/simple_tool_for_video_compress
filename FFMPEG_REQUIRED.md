# ⚠️ FFmpeg Required - Installation Instructions

Your video compression tool encountered an error because **FFmpeg is not installed** on your system.

## 🚨 The Error

```
The system cannot find the path specified.
```

This means FFmpeg is not in your system PATH.

## ✅ Quick Fix (3 Steps)

### Step 1: Install FFmpeg

**Using Chocolatey (Easiest):**
```bash
choco install ffmpeg
```

**Or download manually:**
- Go to https://ffmpeg.org/download.html
- Download Windows build
- Extract to `C:\ffmpeg`
- Add `C:\ffmpeg\bin` to your system PATH

### Step 2: Verify Installation

```bash
ffmpeg -version
```

You should see version information.

### Step 3: Restart and Try Again

```bash
# Restart the worker
npm run worker

# Try uploading a video again
```

## 📋 Detailed Installation Guide

See [INSTALL_FFMPEG.md](./INSTALL_FFMPEG.md) for:
- Step-by-step installation instructions
- Multiple installation methods
- Troubleshooting tips
- Manual configuration options

## 🔧 If FFmpeg is Already Installed

If FFmpeg is installed but not in PATH:

1. Find FFmpeg location:
   ```bash
   # Search for ffmpeg.exe on your system
   # Usually: C:\ffmpeg\bin\ffmpeg.exe
   ```

2. Update `backend/.env`:
   ```
   FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
   FFPROBE_PATH=C:\ffmpeg\bin\ffprobe.exe
   ```

3. Restart worker:
   ```bash
   npm run worker
   ```

## 🎯 Next Steps

1. **Install FFmpeg** using one of the methods above
2. **Verify** with `ffmpeg -version`
3. **Restart** the worker: `npm run worker`
4. **Try uploading** a video again

Your compression tool will work once FFmpeg is installed! 🎬

## 📚 More Help

- [INSTALL_FFMPEG.md](./INSTALL_FFMPEG.md) - Detailed installation guide
- [RUNNING.md](./RUNNING.md) - How to run the system
- [FRONTEND.md](./docs/FRONTEND.md) - UI guide
