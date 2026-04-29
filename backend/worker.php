#!/usr/bin/env php
<?php

require __DIR__ . '/vendor/autoload.php';

use App\Models\CompressionJob;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

// Load Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🎬 Video Compression Worker Started\n";
echo "Monitoring for pending jobs...\n\n";

while (true) {
    try {
        // Find pending jobs
        $pendingJobs = CompressionJob::where('status', 'pending')->get();

        if ($pendingJobs->count() > 0) {
            echo "[" . date('Y-m-d H:i:s') . "] Found " . $pendingJobs->count() . " pending job(s)\n";

            foreach ($pendingJobs as $job) {
                processJob($job);
            }
        }

        // Sleep for 2 seconds before checking again
        sleep(2);

    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
        sleep(5);
    }
}

function processJob(CompressionJob $job)
{
    try {
        echo "  Processing job #{$job->id}: {$job->input_file}\n";

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

        // Get file sizes
        $outputSize = filesize($outputFile);
        $inputSize = filesize($inputFile);
        $reduction = round(((1 - $outputSize / $inputSize) * 100), 2);

        $job->update([
            'status' => 'completed',
            'progress' => 100,
            'output_size' => $outputSize,
            'input_size' => $inputSize,
            'completed_at' => now(),
        ]);

        echo "  ✓ Job #{$job->id} completed! Reduction: {$reduction}%\n";

    } catch (\Exception $e) {
        echo "  ✗ Job #{$job->id} failed: " . $e->getMessage() . "\n";

        $job->update([
            'status' => 'failed',
            'error_message' => substr($e->getMessage(), 0, 500),
            'completed_at' => now(),
        ]);
    }
}
