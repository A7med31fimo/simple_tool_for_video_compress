<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compression_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('input_file');
            $table->string('output_file')->nullable();
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->string('preset')->default('medium');
            $table->integer('crf')->default(23);
            $table->string('profile')->default('high');
            $table->string('level')->default('4.1');
            $table->string('bitrate')->nullable();
            $table->string('tune')->nullable();
            $table->integer('aq_mode')->nullable();
            $table->decimal('aq_strength', 3, 1)->nullable();
            $table->integer('ref_frames')->nullable();
            $table->integer('b_frames')->nullable();
            $table->integer('lookahead')->nullable();
            $table->integer('progress')->default(0);
            $table->text('error_message')->nullable();
            $table->bigInteger('input_size')->nullable();
            $table->bigInteger('output_size')->nullable();
            $table->decimal('duration', 8, 2)->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compression_jobs');
    }
};
