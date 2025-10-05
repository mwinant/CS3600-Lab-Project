<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run()
    {
            DB::table('courses')->insert([
        [
            'title' => 'CS 4622 Applied Data Science',
            'date' => '2025-10-07', // Tuesday
            'time' => '18:00:00',
            'semester' => 'Fall 2025',
        ],
        [
            'title' => 'CS 4622 Applied Data Science',
            'date' => '2025-10-09', // Thursday
            'time' => '18:00:00',
            'semester' => 'Fall 2025',
        ],
        [
            'title' => 'CS3600 Database Systems',
            'date' => '2025-10-07', // Tuesday
            'time' => '11:00:00',
            'semester' => 'Fall 2025',
        ],
        [
            'title' => 'CS3600 Database Systems',
            'date' => '2025-10-09', // Thursday
            'time' => '11:00:00',
            'semester' => 'Fall 2025',
        ],
        [
            'title' => 'CS3600 Database Systems',
            'date' => '2025-10-09', // Thursday
            'time' => '16:30:00',
            'semester' => 'Fall 2025',
        ],
    ]);
    }
}
