<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Survey
 *
 * @property int $id
 * @property int $user_id
 * @property int $survey_year
 * @property int $quarter
 * @property string $employment_status
 * @property string|null $unemployment_reason
 * @property int|null $months_to_get_job
 * @property string|null $job_type
 * @property string|null $work_field
 * @property string|null $employer_name
 * @property \Illuminate\Support\Carbon|null $job_start_date
 * @property string|null $how_found_job
 * @property string|null $position
 * @property string|null $work_relevance
 * @property string|null $first_salary
 * @property bool $is_completed
 * @property \Illuminate\Support\Carbon|null $submitted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Survey newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Survey newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Survey query()
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereEmployerName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereEmploymentStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereFirstSalary($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereHowFoundJob($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereIsCompleted($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereJobStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereJobType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereMonthsToGetJob($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey wherePosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereQuarter($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereSubmittedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereSurveyYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereUnemploymentReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereWorkField($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey whereWorkRelevance($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey completed()
 * @method static \Illuminate\Database\Eloquent\Builder|Survey employed()
 * @method static \Illuminate\Database\Eloquent\Builder|Survey forYear(int $year)
 * @method static \Illuminate\Database\Eloquent\Builder|Survey forQuarter(int $quarter)
 * @method static \Database\Factories\SurveyFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Survey extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'survey_year',
        'quarter',
        'employment_status',
        'unemployment_reason',
        'months_to_get_job',
        'job_type',
        'work_field',
        'employer_name',
        'job_start_date',
        'how_found_job',
        'position',
        'work_relevance',
        'first_salary',
        'is_completed',
        'submitted_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'survey_year' => 'integer',
        'quarter' => 'integer',
        'months_to_get_job' => 'integer',
        'job_start_date' => 'date',
        'first_salary' => 'decimal:2',
        'is_completed' => 'boolean',
        'submitted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the survey.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include completed surveys.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCompleted($query)
    {
        return $query->where('is_completed', true);
    }

    /**
     * Scope a query to only include employed alumni.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeEmployed($query)
    {
        return $query->where('employment_status', 'employed');
    }

    /**
     * Scope a query for a specific year.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int  $year
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForYear($query, int $year)
    {
        return $query->where('survey_year', $year);
    }

    /**
     * Scope a query for a specific quarter.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int  $quarter
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForQuarter($query, int $quarter)
    {
        return $query->where('quarter', $quarter);
    }

    /**
     * Get the quarter name.
     */
    public function getQuarterNameAttribute(): string
    {
        return match ($this->quarter) {
            1 => 'Q1 (Jan-Mar)',
            2 => 'Q2 (Apr-Jun)',
            3 => 'Q3 (Jul-Sep)',
            4 => 'Q4 (Oct-Dec)',
            default => 'Unknown'
        };
    }

    /**
     * Get the employment status label.
     */
    public function getEmploymentStatusLabelAttribute(): string
    {
        return match ($this->employment_status) {
            'employed' => 'Employed',
            'not_employed' => 'Not Employed',
            default => 'Unknown'
        };
    }
}