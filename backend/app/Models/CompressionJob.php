<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompressionJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'input_file',
        'output_file',
        'status',
        'preset',
        'crf',
        'profile',
        'level',
        'bitrate',
        'tune',
        'aq_mode',
        'aq_strength',
        'ref_frames',
        'b_frames',
        'lookahead',
        'progress',
        'error_message',
        'input_size',
        'output_size',
        'duration',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'progress' => 'integer',
    ];

    public function getCompressionRatioAttribute()
    {
        if ($this->input_size && $this->output_size) {
            return round(($this->input_size / $this->output_size), 2);
        }
        return null;
    }

    public function getReductionPercentageAttribute()
    {
        if ($this->input_size && $this->output_size) {
            return round(((1 - $this->output_size / $this->input_size) * 100), 2);
        }
        return null;
    }
}
