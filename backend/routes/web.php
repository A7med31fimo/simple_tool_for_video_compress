<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompressionJobController;

Route::get('/', function () {
    return view('welcome');
});
Route::middleware('api')->prefix('api')->group(function () {
    Route::apiResource('jobs', CompressionJobController::class);
    Route::get('stats', [CompressionJobController::class, 'stats']);
});
