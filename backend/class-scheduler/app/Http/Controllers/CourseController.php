<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        return response()->json(Course::all());
    }

    public function search(Request $request)
    {
        // Read query parameters ?title=...&semester=...
        $searchTitle = trim(strtolower($request->query('title', '')));
        $searchSemester = trim(strtolower($request->query('semester', '')));

        $query = Course::query();

        if ($searchTitle) {
            $query->whereRaw('LOWER(TRIM(title)) LIKE ?', ["%{$searchTitle}%"]);
        }
        if ($searchSemester) {
            $query->whereRaw('LOWER(TRIM(semester)) LIKE ?', ["%{$searchSemester}%"]);
        }

        $courses = $query->get();

        if ($courses->isEmpty()) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        // Group by title + semester, merge days arrays
        $grouped = [];
        foreach ($courses as $course) {
            $key = strtolower(trim($course->title)) . '-' . strtolower(trim($course->semester));
            if (!isset($grouped[$key])) {
                $grouped[$key] = [
                    'id' => $course->id,
                    'title' => $course->title,
                    'semester' => $course->semester,
                    'days' => [],
                    'start_time' => $course->start_time,
                    'end_time' => $course->end_time,
                ];
            }

            // If your Course model stores days as JSON or array, normalize it
            $days = is_array($course->days) ? $course->days : (json_decode($course->days, true) ?? []);
            foreach ($days as $day) {
                if (!in_array($day, $grouped[$key]['days'])) {
                    $grouped[$key]['days'][] = $day;
                }
            }
        }

        return response()->json(array_values($grouped));
    }
}
