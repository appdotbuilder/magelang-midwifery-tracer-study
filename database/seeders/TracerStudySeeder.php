<?php

namespace Database\Seeders;

use App\Models\Survey;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TracerStudySeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@magelangmidwifery.edu',
            'profile_completed' => true,
        ]);

        // Create dosen users
        $dosens = User::factory()->dosen()->count(3)->create([
            'profile_completed' => true,
        ]);

        // Create alumni users
        $alumni = User::factory()->alumni()->count(50)->create();

        // Create surveys for some alumni
        $alumni->each(function ($alumnus) {
            // Create 1-3 surveys per alumnus
            $surveyCount = random_int(1, 3);
            
            for ($i = 0; $i < $surveyCount; $i++) {
                $year = 2024;
                $quarter = random_int(1, 4);
                
                // Ensure unique year-quarter combinations
                $existingSurvey = $alumnus->surveys()
                    ->where('survey_year', $year)
                    ->where('quarter', $quarter)
                    ->first();
                
                if (!$existingSurvey) {
                    Survey::factory()
                        ->for($alumnus)
                        ->create([
                            'survey_year' => $year,
                            'quarter' => $quarter,
                        ]);
                }
            }
        });

        // Create some specific test surveys for better demo data
        $testAlumni = $alumni->take(10);
        
        $testAlumni->each(function ($alumnus, $index) {
            // Create completed surveys for Q1 and Q2 2024
            foreach ([1, 2] as $quarter) {
                Survey::factory()
                    ->for($alumnus)
                    ->completed()
                    ->employed()
                    ->create([
                        'survey_year' => 2024,
                        'quarter' => $quarter,
                        'work_field' => $index % 2 === 0 ? 'healthcare' : 'non_healthcare',
                        'job_type' => $index % 3 === 0 ? 'government' : 'private',
                    ]);
            }
        });
    }
}