<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->string('name');
            $table->string('code');
            $table->text('description');
            $table->json('meetingTimes');
            
            $table->dropColumn(['title', 'date', 'time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['name', 'code', 'description', 'meetingTimes']);
            $table->string('title');
            $table->date('date');
            $table->time('time');
        });
    }
};
