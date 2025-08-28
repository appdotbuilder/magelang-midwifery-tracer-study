<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => 'alumni',
            'enrollment_year' => fake()->numberBetween(2018, 2022),
            'graduation_year' => fake()->numberBetween(2021, 2024),
            'phone' => fake()->phoneNumber(),
            'profile_completed' => fake()->boolean(70),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user is an admin.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'enrollment_year' => null,
            'graduation_year' => null,
            'profile_completed' => true,
        ]);
    }

    /**
     * Indicate that the user is a dosen.
     */
    public function dosen(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'dosen',
            'enrollment_year' => null,
            'graduation_year' => null,
            'profile_completed' => true,
        ]);
    }

    /**
     * Indicate that the user is an alumni.
     */
    public function alumni(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'alumni',
            'enrollment_year' => fake()->numberBetween(2018, 2022),
            'graduation_year' => fake()->numberBetween(2021, 2024),
        ]);
    }
}
