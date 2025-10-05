<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run()
    {
        Course::create([
            'title' => 'Math 101',
            'date' => '2025-10-06',
            'time' => '09:00:00',
            'semester' => 'Fall 2025'
        ]);

        Course::create([
            'title' => 'Biology 202',
            'date' => '2025-10-07',
            'time' => '11:00:00',
            'semester' => 'Fall 2025'
        ]);

        Course::create([
            'title' => 'History 303',
            'date' => '2025-10-08',
            'time' => '13:00:00',
            'semester' => 'Fall 2025'
        ]);
    }
}
