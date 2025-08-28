<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Models\Survey;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        if ($user->isAlumni()) {
            // Alumni can only see their own surveys
            $surveys = $user->surveys()
                ->latest('survey_year')
                ->latest('quarter')
                ->paginate(10);
        } else {
            // Admin and Dosen can see all surveys
            $query = Survey::with('user')
                ->latest('survey_year')
                ->latest('quarter');
                
            if ($request->filled('year')) {
                $query->forYear($request->year);
            }
            
            if ($request->filled('quarter')) {
                $query->forQuarter($request->quarter);
            }
            
            if ($request->filled('employment_status')) {
                $query->where('employment_status', $request->employment_status);
            }
            
            $surveys = $query->paginate(10);
        }
        
        return Inertia::render('surveys/index', [
            'surveys' => $surveys,
            'filters' => $request->only(['year', 'quarter', 'employment_status']),
            'canCreate' => $user->isAlumni(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!auth()->user()->isAlumni()) {
            abort(403, 'Only alumni can create surveys.');
        }
        
        $currentYear = date('Y');
        $currentQuarter = ceil(date('n') / 3);
        
        return Inertia::render('surveys/create', [
            'defaultYear' => $currentYear,
            'defaultQuarter' => $currentQuarter,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSurveyRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['is_completed'] = true;
        $data['submitted_at'] = now();
        
        // Clear unused fields based on employment status
        if ($data['employment_status'] === 'not_employed') {
            $data = array_merge($data, [
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
        } else {
            $data['unemployment_reason'] = null;
        }
        
        $survey = Survey::create($data);

        return redirect()->route('surveys.show', $survey)
            ->with('success', 'Survey submitted successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Survey $survey)
    {
        $user = auth()->user();
        
        // Check authorization
        if ($user->isAlumni() && $user->id !== $survey->user_id) {
            abort(403, 'You can only view your own surveys.');
        }
        
        $survey->load('user');
        
        return Inertia::render('surveys/show', [
            'survey' => $survey,
            'canEdit' => $user->isAdmin() || ($user->isAlumni() && $user->id === $survey->user_id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Survey $survey)
    {
        $user = auth()->user();
        
        // Check authorization
        if ($user->isAlumni() && $user->id !== $survey->user_id) {
            abort(403, 'You can only edit your own surveys.');
        }
        
        return Inertia::render('surveys/edit', [
            'survey' => $survey,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        $data = $request->validated();
        $data['is_completed'] = true;
        $data['submitted_at'] = now();
        
        // Clear unused fields based on employment status
        if ($data['employment_status'] === 'not_employed') {
            $data = array_merge($data, [
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
        } else {
            $data['unemployment_reason'] = null;
        }
        
        $survey->update($data);

        return redirect()->route('surveys.show', $survey)
            ->with('success', 'Survey updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Survey $survey)
    {
        $user = auth()->user();
        
        // Only admins can delete surveys
        if (!$user->isAdmin()) {
            abort(403, 'Only administrators can delete surveys.');
        }
        
        $survey->delete();

        return redirect()->route('surveys.index')
            ->with('success', 'Survey deleted successfully.');
    }
}