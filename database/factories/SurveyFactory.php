<?php

namespace Database\Factories;

use App\Models\Survey;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Survey>
 */
class SurveyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Survey>
     */
    protected $model = Survey::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $employmentStatus = fake()->randomElement(['employed', 'not_employed']);
        $isEmployed = $employmentStatus === 'employed';
        
        return [
            'user_id' => User::factory(),
            'survey_year' => fake()->numberBetween(2020, 2024),
            'quarter' => fake()->numberBetween(1, 4),
            'employment_status' => $employmentStatus,
            'unemployment_reason' => !$isEmployed ? fake()->randomElement([
                'Still searching for a job',
                'Pursuing further education',
                'Personal reasons',
                'No suitable opportunities',
                'Health reasons'
            ]) : null,
            'months_to_get_job' => $isEmployed ? fake()->numberBetween(1, 12) : null,
            'job_type' => $isEmployed ? fake()->randomElement(['private', 'government']) : null,
            'work_field' => $isEmployed ? fake()->randomElement(['healthcare', 'non_healthcare']) : null,
            'employer_name' => $isEmployed ? fake()->company() : null,
            'job_start_date' => $isEmployed ? fake()->dateTimeBetween('-2 years', 'now') : null,
            'how_found_job' => $isEmployed ? fake()->randomElement([
                'job_portal',
                'social_media',
                'referral',
                'direct_application',
                'recruitment_event',
                'other'
            ]) : null,
            'position' => $isEmployed ? fake()->jobTitle() : null,
            'work_relevance' => $isEmployed ? fake()->randomElement([
                'very_relevant',
                'relevant',
                'somewhat_relevant',
                'not_relevant'
            ]) : null,
            'first_salary' => $isEmployed ? fake()->numberBetween(3000000, 15000000) : null,
            'is_completed' => fake()->boolean(80), // 80% chance of being completed
            'submitted_at' => fake()->boolean(80) ? fake()->dateTimeBetween('-1 month', 'now') : null,
        ];
    }

    /**
     * Indicate that the survey is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_completed' => true,
            'submitted_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    /**
     * Indicate that the survey is for employed alumni.
     */
    public function employed(): static
    {
        return $this->state(fn (array $attributes) => [
            'employment_status' => 'employed',
            'unemployment_reason' => null,
            'months_to_get_job' => fake()->numberBetween(1, 12),
            'job_type' => fake()->randomElement(['private', 'government']),
            'work_field' => fake()->randomElement(['healthcare', 'non_healthcare']),
            'employer_name' => fake()->company(),
            'job_start_date' => fake()->dateTimeBetween('-2 years', 'now'),
            'how_found_job' => fake()->randomElement([
                'job_portal',
                'social_media',
                'referral',
                'direct_application',
                'recruitment_event',
                'other'
            ]),
            'position' => fake()->jobTitle(),
            'work_relevance' => fake()->randomElement([
                'very_relevant',
                'relevant',
                'somewhat_relevant',
                'not_relevant'
            ]),
            'first_salary' => fake()->numberBetween(3000000, 15000000),
        ]);
    }

    /**
     * Indicate that the survey is for unemployed alumni.
     */
    public function unemployed(): static
    {
        return $this->state(fn (array $attributes) => [
            'employment_status' => 'not_employed',
            'unemployment_reason' => fake()->randomElement([
                'Still searching for a job',
                'Pursuing further education',
                'Personal reasons',
                'No suitable opportunities',
                'Health reasons'
            ]),
            'months_to_get_job' => null,
            'job_type' => null,
            'work_field' => null,
            'employer_name' => null,
            'job_start_date' => null,
            'how_found_job' => null,
            'position' => null,
            'work_relevance' => null,
            'first_salary' => null,
        ]);
    }
}