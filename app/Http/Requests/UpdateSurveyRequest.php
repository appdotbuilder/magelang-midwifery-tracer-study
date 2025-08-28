<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSurveyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $survey = $this->route('survey');
        return auth()->check() && 
               (auth()->user()->isAdmin() || 
                (auth()->user()->isAlumni() && auth()->user()->id === $survey->user_id));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'employment_status' => 'required|in:employed,not_employed',
        ];

        // Add conditional rules based on employment status
        if ($this->employment_status === 'employed') {
            $rules = array_merge($rules, [
                'months_to_get_job' => 'required|integer|min:0|max:60',
                'job_type' => 'required|in:private,government',
                'work_field' => 'required|in:healthcare,non_healthcare',
                'employer_name' => 'required|string|max:255',
                'job_start_date' => 'required|date|before_or_equal:today',
                'how_found_job' => 'required|in:job_portal,social_media,referral,direct_application,recruitment_event,other',
                'position' => 'required|string|max:255',
                'work_relevance' => 'required|in:very_relevant,relevant,somewhat_relevant,not_relevant',
                'first_salary' => 'required|numeric|min:0|max:999999999.99',
            ]);
        } else {
            $rules['unemployment_reason'] = 'required|string|max:1000';
        }

        return $rules;
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employment_status.required' => 'Employment status is required.',
            'months_to_get_job.required' => 'Time to get job is required for employed status.',
            'job_type.required' => 'Job type is required for employed status.',
            'work_field.required' => 'Work field is required for employed status.',
            'employer_name.required' => 'Employer name is required for employed status.',
            'job_start_date.required' => 'Job start date is required for employed status.',
            'how_found_job.required' => 'How you found the job is required for employed status.',
            'position.required' => 'Position is required for employed status.',
            'work_relevance.required' => 'Work relevance is required for employed status.',
            'first_salary.required' => 'First salary is required for employed status.',
            'unemployment_reason.required' => 'Reason for unemployment is required.',
        ];
    }
}