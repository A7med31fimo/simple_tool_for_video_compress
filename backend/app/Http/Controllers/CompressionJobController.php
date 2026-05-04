<?php

namespace App\Http\Controllers;

use App\Models\CompressionJob;
use Illuminate\Http\Request;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class CompressionJobController extends Controller
{
    public function index()
    {
        return CompressionJob::orderBy('created_at', 'desc')->paginate(20);
    }

    /**
     * Upload a video file to the server's storage directory and return
     * the absolute paths FFmpeg needs for input and output.
     *
     * This is the missing step that caused the original "No such file or
     * directory" error: the old code sent only a bare filename, so FFmpeg
     * looked for the file relative to its working directory (which is the
     * Laravel backend root) and never found it.
     */
    public function upload(Request $request)
    {
        \Log::info('[Upload] Request received', ['files' => $request->allFiles()]);
        $request->validate(['video' => 'required|file|mimetypes:video/*']);

        $storagePath = config('compression.storage_path', 'storage/videos');
        // Resolve to an absolute path so nothing depends on cwd
        $storageDir = realpath(base_path($storagePath))
            ?: base_path($storagePath);

        if (!is_dir($storageDir)) {
            mkdir($storageDir, 0755, true);
        }

        $file          = $request->file('video');
        $originalName  = $file->getClientOriginalName();
        // Use a unique prefix to avoid collisions while keeping the original name readable
        $uniqueName    = uniqid('', true) . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $originalName);
        $file->move($storageDir, $uniqueName);

        $ext        = pathinfo($uniqueName, PATHINFO_EXTENSION);
        $base       = pathinfo($uniqueName, PATHINFO_FILENAME);
        $outputName = $base . '_compressed.' . $ext;

        $response = [
            'input_path'  => $storageDir . DIRECTORY_SEPARATOR . $uniqueName,
            'output_path' => $storageDir . DIRECTORY_SEPARATOR . $outputName,
        ];
        \Log::info('[Upload] Returning response', $response);
        return response()->json($response, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'input_file' => 'required|string',
            'output_file' => 'required|string',
            'preset' => 'required|in:ultrafast,superfast,veryfast,faster,fast,medium,slow,slower,veryslow',
            'crf' => 'required|integer|between:0,51',
            'profile' => 'required|in:baseline,main,high',
            'level' => 'required|string',
            'bitrate' => 'nullable|string',
        ]);

        $job = CompressionJob::create([
            ...$validated,
            'status' => 'pending',
            'progress' => 0,
        ]);

        // Try to process immediately
        $this->processJob($job);

        return response()->json($job, 201);
    }

    public function show(CompressionJob $job)
    {
        return $job;
    }

    public function update(Request $request, CompressionJob $job)
    {
        $validated = $request->validate([
            'status' => 'string|in:pending,processing,completed,failed',
            'progress' => 'integer|between:0,100',
            'error_message' => 'nullable|string',
            'output_size' => 'nullable|integer',
            'input_size' => 'nullable|integer',
            'completed_at' => 'nullable|date',
        ]);

        $job->update($validated);
        return $job;
    }

    public function destroy(CompressionJob $job)
    {
        $job->delete();
        return response()->json(null, 204);
    }

    public function stats()
    {
        return response()->json([
            'total_jobs' => CompressionJob::count(),
            'completed' => CompressionJob::where('status', 'completed')->count(),
            'processing' => CompressionJob::where('status', 'processing')->count(),
            'pending' => CompressionJob::where('status', 'pending')->count(),
            'failed' => CompressionJob::where('status', 'failed')->count(),
        ]);
    }

    private function processJob(CompressionJob $job)
    {
        try {
            $job->update([
                'status' => 'processing',
                'started_at' => now(),
            ]);

            $ffmpegPath = config('compression.ffmpeg_path', 'ffmpeg');

            // Resolve to an absolute, real path so FFmpeg never relies on cwd.
            // realpath() returns false when the file doesn't exist yet (output),
            // so we only apply it to the input file.
            $inputFile = realpath($job->input_file) ?: $job->input_file;
            $outputFile = $job->output_file;

            // Guard: fail fast with a clear message rather than a cryptic FFmpeg error
            if (!file_exists($inputFile)) {
                throw new \Exception(
                    "Input file not found on server: {$inputFile}. " .
                    "Ensure the file was uploaded via /api/upload before creating the job."
                );
            }

            // Build FFmpeg command
            $command = [
                $ffmpegPath,
                '-i', $inputFile,
                '-c:v', 'libx264',
                '-preset', $job->preset,
                '-crf', (string) $job->crf,
                '-profile:v', $job->profile,
                '-level', (string) $job->level,
                '-c:a', 'aac',
                '-b:a', '128k',
            ];

            if ($job->bitrate) {
                array_push($command, '-b:v', (string) $job->bitrate);
            }

            array_push($command, '-y', $outputFile);

            $process = new Process($command);
            $process->setTimeout(config('compression.timeout', 3600));
            $process->run();

            if (!$process->isSuccessful()) {
                throw new ProcessFailedException($process);
            }

            // Get output file size
            $outputSize = filesize($outputFile);
            $inputSize = filesize($inputFile);

            $job->update([
                'status' => 'completed',
                'progress' => 100,
                'output_size' => $outputSize,
                'input_size' => $inputSize,
                'completed_at' => now(),
            ]);

        } catch (\Exception $e) {
            $job->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'completed_at' => now(),
            ]);
        }
    }
}