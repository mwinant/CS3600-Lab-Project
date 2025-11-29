<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run()
    {
        // Seed grouped courses with days array
        $courses = [
            [
                'title' => 'CS 4622 Applied Data Science',
                'days' => ['Tue', 'Thu'],
                'start_time' => '18:00:00',
                'end_time' => '19:15:00',
                'semester' => 'Fall 2025',
            ],
            [
                'title' => 'CS3600 Database Systems',
                'days' => ['Tue', 'Thu'],
                'start_time' => '11:00:00',
                'end_time' => '12:15:00',
                'semester' => 'Fall 2025',
            ],
            [
                'title' => 'CS3600 Database Systems',
                'days' => ['Thu'],
                'start_time' => '16:30:00',
                'end_time' => '17:45:00',
                'semester' => 'Fall 2025',
            ],
            [
                'title' => 'Math330 Linear Algebra',
                'days' => ['Mon', 'Wed', 'Fri'],
                'start_time' => '12:00:00',
                'end_time' => '12:50:00',
                'semester' => 'Fall 2025',
            ]
        ];

        foreach ($courses as $course) {
            DB::table('courses')->insert([
                'title'      => $course['title'],
                'days'       => json_encode($course['days']), // store as JSON string
                'start_time' => $course['start_time'],
                'end_time'   => $course['end_time'],
                'semester'   => $course['semester'],
            ]);
        }
    }
}
