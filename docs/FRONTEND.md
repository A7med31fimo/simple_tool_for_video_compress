# Frontend UI Guide

## Overview

The frontend provides a complete web interface for video compression with real-time monitoring and parameter control.

## Features

### 📊 Dashboard
- **Statistics Cards**: Display total jobs, completed, processing, and failed counts
- **Real-time Updates**: Auto-refresh every 3 seconds
- **Responsive Design**: Works on desktop, tablet, and mobile

### 📤 Upload Section

#### File Upload
- Click to select or drag-and-drop video files
- Supports all common video formats (mp4, mkv, avi, mov, etc.)
- Shows selected file name and size

#### Compression Parameters

**Preset** - Encoding speed vs quality tradeoff
- `ultrafast` - Fastest encoding, largest file
- `superfast` - Very fast
- `veryfast` - Fast
- `faster` - Balanced
- `fast` - Medium speed
- `medium` - Default, recommended
- `slow` - Better quality
- `slower` - Very good quality
- `veryslow` - Best quality, slowest

**Quality (CRF)** - Constant Rate Factor
- Range: 0-51
- 0 = Best quality (largest file)
- 23 = Default (good balance)
- 51 = Worst quality (smallest file)
- Use slider to adjust

**H.264 Profile** - Compression algorithm variant
- `baseline` - Maximum compatibility, lowest compression
- `main` - Recommended, good balance
- `high` - Best compression, limited compatibility

**H.264 Level** - Resolution and bitrate limits
- `4.0` - HD (1280x720)
- `4.1` - Full HD (1920x1080)
- `4.2` - 4K (3840x2160)
- `5.0-5.2` - 4K and higher

**Bitrate** (Optional)
- Leave empty for CRF-based quality
- Or specify: `2000k`, `5M`, etc.
- Overrides CRF if set

### 📋 Jobs List

#### Job Card
Each job shows:
- **Input File**: Original video filename
- **Status Badge**: pending, processing, completed, or failed
- **Parameters**: Preset, CRF, profile, level
- **Progress Bar**: Real-time encoding progress (0-100%)
- **Results**: File sizes and compression percentage (when complete)
- **Timestamps**: Creation and completion times
- **Delete Button**: Remove job (disabled while processing)

#### Status Colors
- 🟢 **Completed** - Green border, success badge
- 🔵 **Processing** - Blue border, info badge
- 🔴 **Failed** - Red border, error badge
- 🟡 **Pending** - Yellow border, warning badge

## Usage Workflow

### Step 1: Select Video
1. Click file input or drag-drop a video
2. File name and size appear below input

### Step 2: Configure Parameters
1. Choose **Preset** based on your needs:
   - Fast encoding: `ultrafast` or `fast`
   - Balanced: `medium` (default)
   - High quality: `slow` or `veryslow`

2. Adjust **Quality (CRF)**:
   - Drag slider left for better quality
   - Drag slider right for smaller files
   - Default 23 is good for most cases

3. Select **Profile** and **Level**:
   - Use defaults unless you have specific requirements
   - `main` profile is recommended

4. (Optional) Set **Bitrate**:
   - Leave empty for quality-based encoding
   - Or specify target bitrate

### Step 3: Start Compression
1. Click **"Start Compression"** button
2. Job is created and appears in the list
3. Status shows "pending" initially

### Step 4: Monitor Progress
1. Watch progress bar update in real-time
2. Status changes: pending → processing → completed
3. View compression results when done

### Step 5: View Results
When complete, job card shows:
- ✓ Input and output file sizes
- ✓ Compression percentage
- ✓ Completion timestamp

## Tips & Tricks

### For Streaming/Web
```
Preset: ultrafast or fast
CRF: 28
Profile: main
Level: 4.1
```

### For General Use
```
Preset: medium (default)
CRF: 23
Profile: main
Level: 4.1
```

### For High Quality
```
Preset: slow or veryslow
CRF: 18-20
Profile: high
Level: 4.2 or higher
```

### For Research/Experimentation
```
Preset: veryslow
CRF: 18
Profile: high
Level: 5.1
Bitrate: (leave empty)
```

## Keyboard Shortcuts

- `Tab` - Navigate between form fields
- `Enter` - Submit form (when focused on submit button)
- `Escape` - Close alerts

## Error Handling

### File Upload Errors
- **"Please select a video file"** - No file selected
- **"Failed to create compression job"** - Backend error

### Job Errors
- **"Error: [message]"** - Compression failed, see error message
- **"Failed to delete job"** - Cannot delete job

## Real-time Updates

The frontend automatically:
- Fetches job list every 3 seconds
- Updates statistics every 3 seconds
- Shows progress bar updates
- Displays completion status

## Responsive Design

### Desktop (1200px+)
- Full layout with all features
- Multi-column job cards
- Optimized spacing

### Tablet (768px - 1199px)
- Adjusted grid layout
- Stacked form fields
- Touch-friendly buttons

### Mobile (< 768px)
- Single column layout
- Full-width inputs
- Large touch targets
- Simplified job cards

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight React app (~50KB gzipped)
- Efficient API calls (3-second polling)
- CSS animations for smooth UX
- No external dependencies beyond React and Axios

## Troubleshooting

### Jobs not appearing
- Check backend is running: `npm run backend:serve`
- Check API URL in browser console
- Refresh page (Ctrl+R)

### Progress not updating
- Check network tab in DevTools
- Verify backend is processing jobs
- Check browser console for errors

### Form not submitting
- Ensure file is selected
- Check browser console for errors
- Verify backend is accessible

### Styling issues
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check CSS file is loaded in DevTools

## Development

### Running Frontend Only
```bash
cd frontend
npm run dev
```

### Building for Production
```bash
cd frontend
npm run build
```

### Debugging
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls
- Use React DevTools extension

## API Integration

Frontend communicates with backend via:
- `GET /api/jobs` - Fetch job list
- `POST /api/jobs` - Create new job
- `DELETE /api/jobs/{id}` - Delete job
- `GET /api/stats` - Fetch statistics

See [API Documentation](./API.md) for details.
