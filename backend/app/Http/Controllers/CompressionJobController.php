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
            $inputFile = $job->input_file;
            $outputFile = $job->output_file;

            // Build FFmpeg command
            $command = [
                $ffmpegPath,
                '-i', $inputFile,
                '-c:v', 'libx264',
                '-preset', $job->preset,
                '-crf', $job->crf,
                '-profile:v', $job->profile,
                '-level', $job->level,
                '-c:a', 'aac',
                '-b:a', '128k',
            ];

            if ($job->bitrate) {
                array_push($command, '-b:v', $job->bitrate);
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
