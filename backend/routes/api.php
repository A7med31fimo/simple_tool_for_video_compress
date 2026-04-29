<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompressionJobController;

Route::middleware('api')->prefix('api')->group(function () {
    Route::apiResource('jobs', CompressionJobController::class);
    Route::get('stats', [CompressionJobController::class, 'stats']);
});
