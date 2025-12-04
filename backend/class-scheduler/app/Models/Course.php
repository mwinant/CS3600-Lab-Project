<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title',
        'days',
        'start_time',
        'end_time',
        'start_date',
        'end_date',
        'semester',
    ];

    protected $casts = [
        'days' => 'array',
    ];
}
