<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isAlumni()) {
            return $this->alumniDashboard($user);
        }
        
        return $this->adminDosenDashboard($user);
    }
    
    /**
     * Dashboard for alumni users.
     */
    protected function alumniDashboard($user)
    {
        $totalSurveys = $user->surveys()->count();
        $completedSurveys = $user->surveys()->completed()->count();
        $currentYear = date('Y');
        $currentQuarter = ceil(date('n') / 3);
        
        $recentSurveys = $user->surveys()
            ->latest('survey_year')
            ->latest('quarter')
            ->limit(5)
            ->get();
        
        $stats = [
            'totalSurveys' => $totalSurveys,
            'completedSurveys' => $completedSurveys,
            'currentQuarter' => "Q{$currentQuarter} {$currentYear}",
        ];
        
        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentSurveys' => $recentSurveys,
        ]);
    }
    
    /**
     * Dashboard for admin and dosen users.
     */
    protected function adminDosenDashboard($user)
    {
        // Get basic statistics
        $totalAlumni = User::alumni()->count();
        $activeResponses = Survey::completed()->distinct('user_id')->count();
        $totalSurveys = Survey::completed()->count();
        
        // Calculate employment rate for current year
        $currentYear = (int) date('Y');
        $employmentStats = Survey::completed()
            ->forYear($currentYear)
            ->select('employment_status', DB::raw('count(*) as count'))
            ->groupBy('employment_status')
            ->get()
            ->pluck('count', 'employment_status');
            
        $employed = (int) ($employmentStats['employed'] ?? 0);
        $unemployed = (int) ($employmentStats['not_employed'] ?? 0);
        $total = $employed + $unemployed;
        $employmentRate = $total > 0 ? round(($employed / $total) * 100, 1) : 0;
        
        $currentQuarter = ceil(date('n') / 3);
        
        $stats = [
            'totalAlumni' => $totalAlumni,
            'activeResponses' => $activeResponses,
            'totalSurveys' => $totalSurveys,
            'employmentRate' => $employmentRate,
            'currentQuarter' => "Q{$currentQuarter} {$currentYear}",
        ];
        
        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}