<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CourseController extends Controller
{
    public function index()
    {
        return response()->json(Course::all());
    }
    
    public function search($query)
    {
        // Search by name, code, or description
        $course = Course::where('name', 'LIKE', "%{$query}%")
                       ->orWhere('code', 'LIKE', "%{$query}%")
                       ->orWhere('description', 'LIKE', "%{$query}%")
                       ->first();

        if ($course) {
            return response()->json($course);
        } else {
            return response()->json(['message' => 'Course not found'], 404);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'description' => 'nullable|string',
            'meetingTimes' => 'required|string',
            'semester' => 'required|string|max:100',
        ]);
        
        $course = Course::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Course created successfully',
            'course' => $course
        ], 201);
    }
}
