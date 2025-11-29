<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $casts = [
        'days' => 'array',
    ];
}
