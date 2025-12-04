<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AuthController;

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/search', [CourseController::class, 'search']);
Route::post('/courses/import', [CourseController::class, 'import']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
