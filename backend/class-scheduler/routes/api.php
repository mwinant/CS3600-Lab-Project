<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/search/{query}', [CourseController::class, 'search']);
Route::post('/courses', [CourseController::class, 'store']);
