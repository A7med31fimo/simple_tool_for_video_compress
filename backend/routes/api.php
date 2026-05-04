<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompressionJobController;

Route::post('upload', [CompressionJobController::class, 'upload']);  
Route::apiResource('jobs', CompressionJobController::class);
Route::get('stats', [CompressionJobController::class, 'stats']);
