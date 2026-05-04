<?php

return [
    'ffmpeg_path' => env('FFMPEG_PATH', 'ffmpeg'),
    'ffprobe_path' => env('FFPROBE_PATH', 'ffprobe'),
    'timeout' => env('COMPRESSION_TIMEOUT', 3600),
    'storage_path' => env('COMPRESSION_STORAGE', 'storage/videos'),
    'presets' => [
        'ultrafast' => [
            'preset' => 'ultrafast',
            'crf' => 28,
            'ref' => 1,
            'bframes' => 0,
            'lookahead' => 0,
        ],
        'fast' => [
            'preset' => 'fast',
            'crf' => 25,
            'ref' => 2,
            'bframes' => 2,
            'lookahead' => 20,
        ],
        'medium' => [
            'preset' => 'medium',
            'crf' => 23,
            'ref' => 3,
            'bframes' => 3,
            'lookahead' => 40,
        ],
        'slow' => [
            'preset' => 'slow',
            'crf' => 21,
            'ref' => 4,
            'bframes' => 4,
            'lookahead' => 50,
        ],
        'veryslow' => [
            'preset' => 'veryslow',
            'crf' => 19,
            'ref' => 5,
            'bframes' => 5,
            'lookahead' => 60,
        ],
        'research' => [
            'preset' => 'veryslow',
            'crf' => 18,
            'profile' => 'high',
            'level' => '5.1',
            'ref' => 16,
            'bframes' => 16,
            'lookahead' => 250,
            'aq_mode' => 3,
            'aq_strength' => 1.0,
        ],
    ],
];
