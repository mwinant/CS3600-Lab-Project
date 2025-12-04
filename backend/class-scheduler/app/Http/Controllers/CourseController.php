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
                    'start_date' => $course->start_date,
                    'end_date' => $course->end_date,
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

    public function import(Request $request)
    {
        // The request will have the courses array directly from JSON
        $coursesData = $request->input('courses', []);
        
        if (empty($coursesData)) {
            return response()->json([
                'message' => 'No courses provided',
                'imported' => 0,
                'errors' => ['No courses array in request']
            ], 422);
        }

        $imported = 0;
        $skipped = 0;
        $errors = [];

        foreach ($coursesData as $idx => $courseData) {
            try {
                // Parse days string into array (e.g., "mwf" -> ["m", "w", "f"])
                $daysString = isset($courseData['days']) ? $courseData['days'] : '';
                $daysArray = $this->parseDays($daysString);

                // If no days (research/thesis courses), skip for now
                if (empty($daysArray)) {
                    $skipped++;
                    continue;
                }

                // If no start_time, set a default
                $startTime = $courseData['start_time'] ?? '09:00:00';
                
                // Ensure time is in HH:MM:SS format
                if (!preg_match('/\d{2}:\d{2}:\d{2}/', $startTime)) {
                    // Convert 12:30 pm format to 12:30:00 or 24-hour format
                    $startTime = $this->convertTimeFormat($startTime);
                }

                // Create course entry
                // Convert date strings like "2026-01-14" to proper format
                $startDate = $this->convertDateFormat($courseData['start_date'] ?? null);
                $endDate = $this->convertDateFormat($courseData['end_date'] ?? null);
                
                Course::create([
                    'title' => $courseData['title'] ?? 'Untitled',
                    'days' => json_encode($daysArray),
                    'start_time' => $startTime,
                    'end_time' => isset($courseData['end_time']) ? $this->convertTimeFormat($courseData['end_time']) : null,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'semester' => $courseData['semester'] ?? 'Spring',
                ]);

                $imported++;
            } catch (\Exception $e) {
                $errors[] = "Row $idx (" . ($courseData['title'] ?? 'Unknown') . "): " . $e->getMessage();
            }
        }

        return response()->json([
            'message' => "Imported $imported courses (skipped $skipped without schedules)",
            'imported' => $imported,
            'skipped' => $skipped,
            'errors' => $errors,
        ], 200);
    }

    private function convertTimeFormat($timeStr)
    {
        if (empty($timeStr)) {
            return '09:00:00';
        }

        // Already in HH:MM:SS format
        if (preg_match('/\d{2}:\d{2}:\d{2}/', $timeStr)) {
            return $timeStr;
        }

        // Parse 12:30 pm or 12:30am format
        $match = [];
        if (preg_match('/(\d{1,2}):(\d{2})\s*(am|pm)?/i', $timeStr, $match)) {
            $hours = intval($match[1]);
            $minutes = $match[2];
            $period = strtolower($match[3] ?? '');

            if ($period === 'pm' && $hours !== 12) {
                $hours += 12;
            } elseif ($period === 'am' && $hours === 12) {
                $hours = 0;
            }

            return sprintf('%02d:%s:00', $hours, $minutes);
        }

        return '09:00:00';
    }

    private function parseDays($daysString)
    {
        if (empty($daysString)) {
            return [];
        }

        $daysString = strtolower(trim($daysString));
        $daysArray = [];
        $i = 0;
        while ($i < strlen($daysString)) {
            if ($i + 1 < strlen($daysString) && substr($daysString, $i, 2) === 'tu') {
                $daysArray[] = 'tu';
                $i += 2;
            } elseif ($i + 1 < strlen($daysString) && substr($daysString, $i, 2) === 'th') {
                $daysArray[] = 'th';
                $i += 2;
            } elseif (in_array($daysString[$i], ['m', 'w', 'f'])) {
                $daysArray[] = $daysString[$i];
                $i++;
            } else {
                $i++;
            }
        }

        return array_unique($daysArray);
    }

    private function convertDateFormat($dateString)
    {
        if (empty($dateString)) {
            return null;
        }

        // If already in YYYY-MM-DD format, return as-is
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateString)) {
            return $dateString;
        }

        // Convert "Jan 14, 2026" or "Jan 14 2026" to "2026-01-14"
        $dateString = trim($dateString);
        $pattern = '/(\w+)\s+(\d{1,2}),?\s+(\d{4})/';
        
        if (preg_match($pattern, $dateString, $matches)) {
            $month = $matches[1];
            $day = str_pad($matches[2], 2, '0', STR_PAD_LEFT);
            $year = $matches[3];
            
            $months = [
                'jan' => '01', 'feb' => '02', 'mar' => '03', 'apr' => '04',
                'may' => '05', 'jun' => '06', 'jul' => '07', 'aug' => '08',
                'sep' => '09', 'oct' => '10', 'nov' => '11', 'dec' => '12'
            ];
            
            $monthNum = $months[strtolower(substr($month, 0, 3))] ?? null;
            
            if ($monthNum) {
                return "$year-$monthNum-$day";
            }
        }
        
        return null;
    }
}