<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    
    // Survey routes - accessible by all authenticated users with appropriate permissions
    Route::resource('surveys', App\Http\Controllers\SurveyController::class);
    
    // Report routes - restricted to admin and dosen
    Route::get('reports', [App\Http\Controllers\ReportController::class, 'index'])
        ->name('reports.index')
        ->middleware(App\Http\Middleware\CheckReportsAccess::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
