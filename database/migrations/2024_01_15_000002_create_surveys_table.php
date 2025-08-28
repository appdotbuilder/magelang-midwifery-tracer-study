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
        Schema::create('surveys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->year('survey_year');
            $table->integer('quarter'); // 1, 2, 3, 4
            $table->enum('employment_status', ['employed', 'not_employed']);
            $table->text('unemployment_reason')->nullable();
            $table->integer('months_to_get_job')->nullable();
            $table->enum('job_type', ['private', 'government'])->nullable();
            $table->enum('work_field', ['healthcare', 'non_healthcare'])->nullable();
            $table->string('employer_name')->nullable();
            $table->date('job_start_date')->nullable();
            $table->enum('how_found_job', [
                'job_portal',
                'social_media',
                'referral',
                'direct_application',
                'recruitment_event',
                'other'
            ])->nullable();
            $table->string('position')->nullable();
            $table->enum('work_relevance', [
                'very_relevant',
                'relevant',
                'somewhat_relevant',
                'not_relevant'
            ])->nullable();
            $table->decimal('first_salary', 12, 2)->nullable();
            $table->boolean('is_completed')->default(false);
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
            
            // Composite unique index to prevent duplicate surveys
            $table->unique(['user_id', 'survey_year', 'quarter']);
            
            // Add indexes for performance
            $table->index('survey_year');
            $table->index('quarter');
            $table->index('employment_status');
            $table->index('job_type');
            $table->index('work_field');
            $table->index('is_completed');
            $table->index(['survey_year', 'quarter']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surveys');
    }
};