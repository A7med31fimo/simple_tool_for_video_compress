# Architecture

## Overview

Simple Tool for Video Compress is a full-stack application with three main components:

1. **CLI Tool** (Node.js) - Command-line interface for video compression
2. **Backend API** (Laravel) - RESTful API for job management
3. **Frontend UI** (React) - Web interface for monitoring and control

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface                           │
├─────────────────────────────────────────────────────────────┤
│  CLI Tool (Node.js)  │  React Frontend  │  Direct FFmpeg    │
└──────────┬───────────┴────────┬─────────┴──────────┬────────┘
           │                    │                    │
           └────────────────────┼────────────────────┘
                                │
                    ┌───────────▼──────────┐
                    │   Laravel Backend    │
                    │   (REST API)         │
                    └───────────┬──────────┘
                                │
                    ┌───────────▼──────────┐
                    │   SQLite Database    │
                    │   (Job Storage)      │
                    └──────────────────────┘
                                │
                    ┌───────────▼──────────┐
                    │  FFmpeg + x264       │
                    │  (Encoding Engine)   │
                    └──────────────────────┘
```

## Component Details

### CLI Tool (Node.js)

**Purpose:** Command-line interface for video compression

**Key Features:**
- Direct FFmpeg integration
- Batch processing
- Video analysis and statistics
- Preset management
- Optional API integration

**Technologies:**
- Node.js 18+
- Commander.js (CLI framework)
- Fluent-FFmpeg (FFmpeg wrapper)
- Chalk (colored output)
- Ora (progress spinners)

**Entry Point:** `cli/index.js`

### Backend API (Laravel)

**Purpose:** Job management and API interface

**Key Features:**
- Job creation and tracking
- Status monitoring
- Statistics and analytics
- Database persistence
- RESTful endpoints

**Technologies:**
- Laravel 10+
- PHP 8.1+
- SQLite (default) or MySQL
- Eloquent ORM

**Key Files:**
- `app/Models/CompressionJob.php` - Job model
- `app/Http/Controllers/CompressionJobController.php` - API controller
- `routes/api.php` - API routes
- `database/migrations/` - Database schema

### Frontend UI (React)

**Purpose:** Web interface for job monitoring

**Key Features:**
- Real-time job status
- Statistics dashboard
- Job management
- Responsive design

**Technologies:**
- React 18+
- Vite (build tool)
- Axios (HTTP client)
- CSS3

**Key Files:**
- `src/App.jsx` - Main component
- `src/index.css` - Styling
- `vite.config.js` - Build configuration

## Data Flow

### Compression Job Lifecycle

```
1. User initiates compression
   ├─ CLI: Direct FFmpeg execution
   ├─ API: POST /api/jobs
   └─ Frontend: Create job via API

2. Job created in database
   └─ Status: pending

3. Job processing starts
   ├─ Status: processing
   ├─ Progress: 0-100%
   └─ FFmpeg encoding

4. Job completes
   ├─ Status: completed
   ├─ Progress: 100%
   └─ Output file ready

5. User retrieves results
   ├─ CLI: Local file
   ├─ API: GET /api/jobs/{id}
   └─ Frontend: Display in UI
```

## Database Schema

### compression_jobs Table

```sql
CREATE TABLE compression_jobs (
  id BIGINT PRIMARY KEY,
  input_file VARCHAR(255),
  output_file VARCHAR(255),
  status ENUM('pending', 'processing', 'completed', 'failed'),
  preset VARCHAR(50),
  crf INT,
  bitrate VARCHAR(50),
  profile VARCHAR(50),
  level VARCHAR(50),
  two_pass BOOLEAN,
  progress INT,
  error_message TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Configuration

### Environment Variables

**Backend (.env):**
```
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe
COMPRESSION_TIMEOUT=3600
MAX_FILE_SIZE=5368709120
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000/api
```

## Deployment Considerations

### Development
- All components run locally
- SQLite database
- Hot module reloading

### Production
- Separate servers for backend and frontend
- MySQL or PostgreSQL database
- Job queue system (Redis, RabbitMQ)
- Load balancing
- SSL/TLS encryption
- Authentication and authorization
- Rate limiting
- Monitoring and logging

## Performance Optimization

### CLI
- Parallel batch processing
- Efficient FFmpeg parameter building
- Streaming output

### Backend
- Database indexing on status and created_at
- Pagination for job lists
- Caching for statistics
- Async job processing

### Frontend
- React component memoization
- Efficient state management
- CSS optimization
- Image lazy loading

## Security Considerations

1. **Input Validation**
   - File path validation
   - Parameter range checking
   - File type verification

2. **File Handling**
   - Secure temporary file storage
   - Proper cleanup after processing
   - Access control

3. **API Security**
   - CORS configuration
   - Rate limiting
   - Input sanitization
   - Authentication (production)

4. **FFmpeg Security**
   - Proper argument escaping
   - Resource limits
   - Timeout enforcement

## Extensibility

### Adding New Presets
Edit `backend/config/compression.php` and `cli/commands/presets.js`

### Adding New Encoding Parameters
1. Update database migration
2. Update CompressionJob model
3. Update API controller
4. Update CLI commands
5. Update frontend UI

### Adding New Output Formats
Extend FFmpeg command building in compression commands

## Testing Strategy

### Unit Tests
- Model tests
- Controller tests
- Command tests

### Integration Tests
- API endpoint tests
- Database tests
- FFmpeg integration tests

### E2E Tests
- CLI workflow tests
- API workflow tests
- Frontend workflow tests
