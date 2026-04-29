<?php

namespace App\Console\Commands;

use App\Models\CompressionJob;
use Illuminate\Console\Command;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class ProcessCompressionJobs extends Command
{
    protected $signature = 'compression:process {--watch : Keep watching for new jobs}';
    protected $description = 'Process pending video compression jobs';

    public function handle()
    {
        $watch = $this->option('watch');

        if ($watch) {
            $this->info('🎬 Video Compression Worker Started');
            $this->info('Watching for pending jobs...');
            $this->newLine();

            while (true) {
                $this->processPendingJobs();
                sleep(2);
            }
        } else {
            $this->processPendingJobs();
        }
    }

    private function processPendingJobs()
    {
        $pendingJobs = CompressionJob::where('status', 'pending')
            ->orderBy('created_at', 'asc')
            ->get();

        if ($pendingJobs->count() === 0) {
            return;
        }

        $this->info('[' . now()->format('Y-m-d H:i:s') . '] Found ' . $pendingJobs->count() . ' pending job(s)');

        foreach ($pendingJobs as $job) {
            $this->processJob($job);
        }
    }

    private function processJob(CompressionJob $job)
    {
        try {
            $this->line("  Processing job #{$job->id}: {$job->input_file}");

            $job->update([
                'status' => 'processing',
                'started_at' => now(),
            ]);

            $ffmpegPath = config('compression.ffmpeg_path', 'ffmpeg');
            $inputFile = $job->input_file;
            $outputFile = $job->output_file;

            // Check if input file exists
            if (!file_exists($inputFile)) {
                throw new \Exception("Input file not found: {$inputFile}");
            }

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
            if (!file_exists($outputFile)) {
                throw new \Exception("Output file was not created");
            }

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

            $this->info("  ✓ Job #{$job->id} completed! Reduction: {$reduction}%");

        } catch (\Exception $e) {
            $this->error("  ✗ Job #{$job->id} failed: " . $e->getMessage());

            $job->update([
                'status' => 'failed',
                'error_message' => substr($e->getMessage(), 0, 500),
                'completed_at' => now(),
            ]);
        }
    }
}
