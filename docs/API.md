# Backend API Documentation

## Overview

The Laravel backend provides a RESTful API for managing video compression jobs. It handles job creation, status tracking, and compression statistics.

## Base URL

```
http://localhost:8000/api
```

## Endpoints

### Jobs

#### List Jobs
```
GET /jobs
```

Returns paginated list of compression jobs.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "input_file": "video.mp4",
      "output_file": "video_compressed.mp4",
      "status": "completed",
      "preset": "medium",
      "crf": 23,
      "bitrate": null,
      "profile": "main",
      "level": "4.1",
      "two_pass": false,
      "progress": 100,
      "error_message": null,
      "started_at": "2024-01-15T10:30:00Z",
      "completed_at": "2024-01-15T10:45:00Z",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:45:00Z"
    }
  ],
  "links": {},
  "meta": {}
}
```

#### Create Job
```
POST /jobs
```

Create a new compression job.

**Request Body:**
```json
{
  "input_file": "video.mp4",
  "output_file": "video_compressed.mp4",
  "preset": "medium",
  "crf": 23,
  "bitrate": null,
  "profile": "main",
  "level": "4.1",
  "two_pass": false
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "input_file": "video.mp4",
  "output_file": "video_compressed.mp4",
  "status": "pending",
  "preset": "medium",
  "crf": 23,
  "bitrate": null,
  "profile": "main",
  "level": "4.1",
  "two_pass": false,
  "progress": 0,
  "error_message": null,
  "started_at": null,
  "completed_at": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Get Job
```
GET /jobs/{id}
```

Get details of a specific compression job.

#### Delete Job
```
DELETE /jobs/{id}
```

Delete a compression job. Cannot delete jobs that are currently processing.

**Response:** `204 No Content`

### Statistics

#### Job Statistics
```
GET /stats/jobs
```

Get overall compression statistics.

**Response:**
```json
{
  "total_jobs": 42,
  "completed": 38,
  "processing": 1,
  "pending": 2,
  "failed": 1,
  "average_compression_time": 900
}
```

## Status Values

- `pending` - Job queued, waiting to start
- `processing` - Job currently running
- `completed` - Job finished successfully
- `failed` - Job failed with error

## Presets

Available encoding presets:

| Preset | Speed | Quality | Use Case |
|--------|-------|---------|----------|
| ultrafast | Fastest | Lowest | Real-time streaming |
| superfast | Very Fast | Low | Fast encoding |
| veryfast | Fast | Low-Medium | Quick processing |
| faster | Fast | Medium | Balanced |
| fast | Medium | Medium | General purpose |
| medium | Medium | Good | Default, recommended |
| slow | Slow | Very Good | High quality |
| slower | Very Slow | Excellent | Archive |
| veryslow | Extremely Slow | Best | Maximum quality |

## H.264 Profiles

- `baseline` - Maximum compatibility, lowest compression
- `main` - Good compatibility, better compression (recommended)
- `high` - Best compression, limited compatibility

## H.264 Levels

- `4.0` - HD (1280x720)
- `4.1` - Full HD (1920x1080)
- `4.2` - 4K (3840x2160)
- `5.0` - 4K
- `5.1` - 4K
- `5.2` - 8K

## Error Handling

All errors return appropriate HTTP status codes with error details:

```json
{
  "error": "Error message",
  "status": 422
}
```

## Rate Limiting

No rate limiting is currently implemented. Production deployments should add rate limiting middleware.

## Authentication

Currently no authentication is required. Production deployments should implement API authentication.

## CORS

CORS is configured to allow requests from the frontend application.
