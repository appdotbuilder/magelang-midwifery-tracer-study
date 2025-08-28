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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['alumni', 'admin', 'dosen'])->default('alumni')->after('email');
            $table->string('enrollment_year', 4)->nullable()->after('role');
            $table->string('graduation_year', 4)->nullable()->after('enrollment_year');
            $table->string('phone', 20)->nullable()->after('graduation_year');
            $table->boolean('profile_completed')->default(false)->after('phone');
            
            // Add indexes for performance
            $table->index('role');
            $table->index('enrollment_year');
            $table->index('graduation_year');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'enrollment_year',
                'graduation_year',
                'phone',
                'profile_completed'
            ]);
        });
    }
};