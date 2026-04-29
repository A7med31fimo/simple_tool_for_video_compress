<?php

namespace App\Http\Controllers;

use App\Models\CompressionJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'tune' => 'nullable|string',
            'aq_mode' => 'nullable|integer|between:0,3',
            'aq_strength' => 'nullable|numeric',
            'ref_frames' => 'nullable|integer|between:1,16',
            'b_frames' => 'nullable|integer|between:0,16',
            'lookahead' => 'nullable|integer|between:0,250',
        ]);

        $job = CompressionJob::create([
            ...$validated,
            'status' => 'pending',
            'progress' => 0,
        ]);

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
            'failed' => CompressionJob::where('status', 'failed')->count(),
            'total_input_size' => CompressionJob::sum('input_size'),
            'total_output_size' => CompressionJob::sum('output_size'),
        ]);
    }
}
