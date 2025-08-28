<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display the analytics dashboard.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Only admin and dosen can access reports
        if (!$user->isAdmin() && !$user->isDosen()) {
            abort(403, 'Access denied. Only administrators and lecturers can view reports.');
        }
        
        $year = (int) $request->get('year', date('Y'));
        $quarter = $request->get('quarter');
        
        // Build query based on filters
        $baseQuery = Survey::completed();
        
        if ($year) {
            $baseQuery->forYear($year);
        }
        
        if ($quarter) {
            $baseQuery->forQuarter($quarter);
        }
        
        // Employment statistics
        $employmentStats = $this->getEmploymentStatistics($baseQuery);
        
        // Job type distribution
        $jobTypeStats = $this->getJobTypeStatistics($baseQuery);
        
        // Work field distribution
        $workFieldStats = $this->getWorkFieldStatistics($baseQuery);
        
        // Salary statistics
        $salaryStats = $this->getSalaryStatistics($baseQuery);
        
        // Time to employment statistics
        $timeToJobStats = $this->getTimeToJobStatistics($baseQuery);
        
        // Work relevance statistics
        $workRelevanceStats = $this->getWorkRelevanceStatistics($baseQuery);
        
        // How found job statistics
        $howFoundJobStats = $this->getHowFoundJobStatistics($baseQuery);
        
        // Quarterly trends
        $quarterlyTrends = $this->getQuarterlyTrends($year);
        
        // Alumni overview
        $alumniOverview = $this->getAlumniOverview();
        
        return Inertia::render('reports/index', [
            'employmentStats' => $employmentStats,
            'jobTypeStats' => $jobTypeStats,
            'workFieldStats' => $workFieldStats,
            'salaryStats' => $salaryStats,
            'timeToJobStats' => $timeToJobStats,
            'workRelevanceStats' => $workRelevanceStats,
            'howFoundJobStats' => $howFoundJobStats,
            'quarterlyTrends' => $quarterlyTrends,
            'alumniOverview' => $alumniOverview,
            'filters' => [
                'year' => $year,
                'quarter' => $quarter,
            ],
            'availableYears' => $this->getAvailableYears(),
        ]);
    }
    
    /**
     * Get employment statistics.
     */
    protected function getEmploymentStatistics($baseQuery)
    {
        $total = (clone $baseQuery)->count();
        $employed = (clone $baseQuery)->employed()->count();
        $unemployed = $total - $employed;
        
        return [
            'total' => $total,
            'employed' => $employed,
            'unemployed' => $unemployed,
            'employment_rate' => $total > 0 ? round(($employed / $total) * 100, 2) : 0,
        ];
    }
    
    /**
     * Get job type statistics.
     */
    protected function getJobTypeStatistics($baseQuery)
    {
        return (clone $baseQuery)
            ->employed()
            ->select('job_type', DB::raw('count(*) as count'))
            ->groupBy('job_type')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->job_type => $item->count];
            });
    }
    
    /**
     * Get work field statistics.
     */
    protected function getWorkFieldStatistics($baseQuery)
    {
        return (clone $baseQuery)
            ->employed()
            ->select('work_field', DB::raw('count(*) as count'))
            ->groupBy('work_field')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->work_field => $item->count];
            });
    }
    
    /**
     * Get salary statistics.
     */
    protected function getSalaryStatistics($baseQuery)
    {
        $salaryData = (clone $baseQuery)
            ->employed()
            ->whereNotNull('first_salary')
            ->selectRaw('
                AVG(first_salary) as average,
                MIN(first_salary) as minimum,
                MAX(first_salary) as maximum,
                COUNT(*) as count
            ')
            ->first();
            
        // Salary ranges
        $salaryRanges = (clone $baseQuery)
            ->employed()
            ->whereNotNull('first_salary')
            ->selectRaw("
                CASE 
                    WHEN first_salary < 3000000 THEN 'Below 3M'
                    WHEN first_salary >= 3000000 AND first_salary < 5000000 THEN '3M - 5M'
                    WHEN first_salary >= 5000000 AND first_salary < 8000000 THEN '5M - 8M'
                    WHEN first_salary >= 8000000 AND first_salary < 12000000 THEN '8M - 12M'
                    ELSE 'Above 12M'
                END as range,
                COUNT(*) as count
            ")
            ->groupBy('range')
            ->get()
            ->pluck('count', 'range');
        
        return [
            'average' => $salaryData->average ? round($salaryData->average, 0) : 0,
            'minimum' => $salaryData->minimum ?? 0,
            'maximum' => $salaryData->maximum ?? 0,
            'count' => $salaryData->count ?? 0,
            'ranges' => $salaryRanges,
        ];
    }
    
    /**
     * Get time to job statistics.
     */
    protected function getTimeToJobStatistics($baseQuery)
    {
        $timeData = (clone $baseQuery)
            ->employed()
            ->whereNotNull('months_to_get_job')
            ->selectRaw('
                AVG(months_to_get_job) as average,
                MIN(months_to_get_job) as minimum,
                MAX(months_to_get_job) as maximum
            ')
            ->first();
            
        // Time ranges
        $timeRanges = (clone $baseQuery)
            ->employed()
            ->whereNotNull('months_to_get_job')
            ->selectRaw("
                CASE 
                    WHEN months_to_get_job = 0 THEN 'Immediate'
                    WHEN months_to_get_job >= 1 AND months_to_get_job <= 3 THEN '1-3 months'
                    WHEN months_to_get_job >= 4 AND months_to_get_job <= 6 THEN '4-6 months'
                    WHEN months_to_get_job >= 7 AND months_to_get_job <= 12 THEN '7-12 months'
                    ELSE 'More than 1 year'
                END as range,
                COUNT(*) as count
            ")
            ->groupBy('range')
            ->get()
            ->pluck('count', 'range');
        
        return [
            'average' => $timeData->average ? round($timeData->average, 1) : 0,
            'minimum' => $timeData->minimum ?? 0,
            'maximum' => $timeData->maximum ?? 0,
            'ranges' => $timeRanges,
        ];
    }
    
    /**
     * Get work relevance statistics.
     */
    protected function getWorkRelevanceStatistics($baseQuery)
    {
        return (clone $baseQuery)
            ->employed()
            ->select('work_relevance', DB::raw('count(*) as count'))
            ->groupBy('work_relevance')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->work_relevance => $item->count];
            });
    }
    
    /**
     * Get how found job statistics.
     */
    protected function getHowFoundJobStatistics($baseQuery)
    {
        return (clone $baseQuery)
            ->employed()
            ->select('how_found_job', DB::raw('count(*) as count'))
            ->groupBy('how_found_job')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->how_found_job => $item->count];
            });
    }
    
    /**
     * Get quarterly trends for a specific year.
     */
    protected function getQuarterlyTrends($year)
    {
        $trends = Survey::completed()
            ->forYear($year)
            ->select(
                'quarter',
                'employment_status',
                DB::raw('count(*) as count')
            )
            ->groupBy('quarter', 'employment_status')
            ->orderBy('quarter')
            ->get()
            ->groupBy('quarter')
            ->map(function ($quarterData) {
                $employed = (int) ($quarterData->where('employment_status', 'employed')->first()->count ?? 0);
                $unemployed = (int) ($quarterData->where('employment_status', 'not_employed')->first()->count ?? 0);
                $total = $employed + $unemployed;
                
                return [
                    'employed' => $employed,
                    'unemployed' => $unemployed,
                    'total' => $total,
                    'employment_rate' => $total > 0 ? round(($employed / $total) * 100, 2) : 0,
                ];
            });
        
        // Fill in missing quarters
        for ($q = 1; $q <= 4; $q++) {
            if (!$trends->has($q)) {
                $trends[$q] = [
                    'employed' => 0,
                    'unemployed' => 0,
                    'total' => 0,
                    'employment_rate' => 0,
                ];
            }
        }
        
        return $trends->sortKeys();
    }
    
    /**
     * Get alumni overview statistics.
     */
    protected function getAlumniOverview()
    {
        $totalAlumni = User::alumni()->count();
        $completedProfiles = User::alumni()->where('profile_completed', true)->count();
        $activeSurveyResponses = Survey::completed()->distinct('user_id')->count();
        
        return [
            'total_alumni' => $totalAlumni,
            'completed_profiles' => $completedProfiles,
            'active_responses' => $activeSurveyResponses,
            'profile_completion_rate' => $totalAlumni > 0 ? round(($completedProfiles / $totalAlumni) * 100, 2) : 0,
            'response_rate' => $totalAlumni > 0 ? round(($activeSurveyResponses / $totalAlumni) * 100, 2) : 0,
        ];
    }
    
    /**
     * Get available years for filtering.
     */
    protected function getAvailableYears()
    {
        return Survey::select('survey_year')
            ->distinct()
            ->orderBy('survey_year', 'desc')
            ->pluck('survey_year')
            ->toArray();
    }
}