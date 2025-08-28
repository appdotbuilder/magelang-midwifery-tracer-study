import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';



interface Props {
    defaultYear: number;
    defaultQuarter: number;
}

export default function CreateSurvey({ defaultYear, defaultQuarter }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        survey_year: defaultYear,
        quarter: defaultQuarter,
        employment_status: '',
        unemployment_reason: '',
        months_to_get_job: '',
        job_type: '',
        work_field: '',
        employer_name: '',
        job_start_date: '',
        how_found_job: '',
        position: '',
        work_relevance: '',
        first_salary: '',
    });

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = data.employment_status === 'employed' ? 4 : 2;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('surveys.store'));
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const getStepTitle = (step: number) => {
        switch (step) {
            case 1: return 'Survey Period & Employment Status';
            case 2: return data.employment_status === 'employed' ? 'Job Details' : 'Unemployment Details';
            case 3: return 'Job Search & Position';
            case 4: return 'Salary & Work Relevance';
            default: return 'Survey';
        }
    };

    return (
        <AppShell>
            <Head title="Create Survey" />
            
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link
                            href={route('surveys.index')}
                            className="text-green-600 hover:text-green-700"
                        >
                            ← Back to Surveys
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">📝 Create New Survey</h1>
                    <p className="text-gray-600">
                        Help us track your career progress by filling out this quarterly survey.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Step {currentStep} of {totalSteps}
                        </span>
                        <span className="text-sm text-gray-500">
                            {Math.round((currentStep / totalSteps) * 100)}% Complete
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            {getStepTitle(currentStep)}
                        </h2>

                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Survey Year *
                                        </label>
                                        <select
                                            value={data.survey_year}
                                            onChange={(e) => setData('survey_year', Number(e.target.value))}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            required
                                        >
                                            <option value={2024}>2024</option>
                                            <option value={2023}>2023</option>
                                            <option value={2022}>2022</option>
                                        </select>
                                        {errors.survey_year && (
                                            <p className="text-red-500 text-sm mt-1">{errors.survey_year}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quarter *
                                        </label>
                                        <select
                                            value={data.quarter}
                                            onChange={(e) => setData('quarter', Number(e.target.value))}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            required
                                        >
                                            <option value={1}>Q1 (January - March)</option>
                                            <option value={2}>Q2 (April - June)</option>
                                            <option value={3}>Q3 (July - September)</option>
                                            <option value={4}>Q4 (October - December)</option>
                                        </select>
                                        {errors.quarter && (
                                            <p className="text-red-500 text-sm mt-1">{errors.quarter}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Employment Status *
                                    </label>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="employed"
                                                checked={data.employment_status === 'employed'}
                                                onChange={(e) => setData('employment_status', e.target.value)}
                                                className="mr-3"
                                                required
                                            />
                                            <div>
                                                <div className="font-medium">🏥 Employed</div>
                                                <div className="text-sm text-gray-500">Currently working in any capacity</div>
                                            </div>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="not_employed"
                                                checked={data.employment_status === 'not_employed'}
                                                onChange={(e) => setData('employment_status', e.target.value)}
                                                className="mr-3"
                                                required
                                            />
                                            <div>
                                                <div className="font-medium">🔍 Not Employed</div>
                                                <div className="text-sm text-gray-500">Currently not working</div>
                                            </div>
                                        </label>
                                    </div>
                                    {errors.employment_status && (
                                        <p className="text-red-500 text-sm mt-1">{errors.employment_status}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Employment Details or Unemployment Reason */}
                        {currentStep === 2 && data.employment_status === 'not_employed' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for Not Being Employed *
                                </label>
                                <textarea
                                    value={data.unemployment_reason}
                                    onChange={(e) => setData('unemployment_reason', e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Please explain why you are currently not employed..."
                                    required
                                />
                                {errors.unemployment_reason && (
                                    <p className="text-red-500 text-sm mt-1">{errors.unemployment_reason}</p>
                                )}
                            </div>
                        )}

                        {currentStep === 2 && data.employment_status === 'employed' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Time to Get Job (months) *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="60"
                                            value={data.months_to_get_job}
                                            onChange={(e) => setData('months_to_get_job', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="0 for immediate employment"
                                            required
                                        />
                                        {errors.months_to_get_job && (
                                            <p className="text-red-500 text-sm mt-1">{errors.months_to_get_job}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Type *
                                        </label>
                                        <select
                                            value={data.job_type}
                                            onChange={(e) => setData('job_type', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            required
                                        >
                                            <option value="">Select job type</option>
                                            <option value="private">Private Sector</option>
                                            <option value="government">Government/Public Sector</option>
                                        </select>
                                        {errors.job_type && (
                                            <p className="text-red-500 text-sm mt-1">{errors.job_type}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Work Field *
                                        </label>
                                        <select
                                            value={data.work_field}
                                            onChange={(e) => setData('work_field', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            required
                                        >
                                            <option value="">Select work field</option>
                                            <option value="healthcare">Healthcare</option>
                                            <option value="non_healthcare">Non-Healthcare</option>
                                        </select>
                                        {errors.work_field && (
                                            <p className="text-red-500 text-sm mt-1">{errors.work_field}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.job_start_date}
                                            onChange={(e) => setData('job_start_date', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            required
                                        />
                                        {errors.job_start_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.job_start_date}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Employer Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.employer_name}
                                        onChange={(e) => setData('employer_name', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="Company or organization name"
                                        required
                                    />
                                    {errors.employer_name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.employer_name}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Job Search and Position */}
                        {currentStep === 3 && data.employment_status === 'employed' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        How Did You Find This Job? *
                                    </label>
                                    <select
                                        value={data.how_found_job}
                                        onChange={(e) => setData('how_found_job', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        required
                                    >
                                        <option value="">Select method</option>
                                        <option value="job_portal">Job Portal/Website</option>
                                        <option value="social_media">Social Media</option>
                                        <option value="referral">Referral/Recommendation</option>
                                        <option value="direct_application">Direct Application</option>
                                        <option value="recruitment_event">Recruitment Event</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.how_found_job && (
                                        <p className="text-red-500 text-sm mt-1">{errors.how_found_job}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Position/Job Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.position}
                                        onChange={(e) => setData('position', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="e.g., Staff Midwife, Clinical Coordinator"
                                        required
                                    />
                                    {errors.position && (
                                        <p className="text-red-500 text-sm mt-1">{errors.position}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Salary and Work Relevance */}
                        {currentStep === 4 && data.employment_status === 'employed' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Work Relevance to Your Skills *
                                    </label>
                                    <div className="space-y-3">
                                        {[
                                            { value: 'very_relevant', label: '🎯 Very Relevant', desc: 'Directly uses midwifery skills' },
                                            { value: 'relevant', label: '✅ Relevant', desc: 'Uses most midwifery skills' },
                                            { value: 'somewhat_relevant', label: '⚡ Somewhat Relevant', desc: 'Uses some midwifery skills' },
                                            { value: 'not_relevant', label: '❌ Not Relevant', desc: 'Does not use midwifery skills' },
                                        ].map((option) => (
                                            <label key={option.value} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={data.work_relevance === option.value}
                                                    onChange={(e) => setData('work_relevance', e.target.value)}
                                                    className="mr-3"
                                                    required
                                                />
                                                <div>
                                                    <div className="font-medium">{option.label}</div>
                                                    <div className="text-sm text-gray-500">{option.desc}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.work_relevance && (
                                        <p className="text-red-500 text-sm mt-1">{errors.work_relevance}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Salary (IDR) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.first_salary}
                                        onChange={(e) => setData('first_salary', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="e.g., 4500000"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Enter your starting salary in Indonesian Rupiah
                                    </p>
                                    {errors.first_salary && (
                                        <p className="text-red-500 text-sm mt-1">{errors.first_salary}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6 border-t">
                            <button
                                type="button"
                                onClick={prevStep}
                                className={`px-4 py-2 rounded-lg ${
                                    currentStep === 1 
                                        ? 'text-gray-400 cursor-not-allowed' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                disabled={currentStep === 1}
                            >
                                Previous
                            </button>
                            
                            <div className="flex space-x-3">
                                {currentStep < totalSteps ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                        disabled={
                                            (currentStep === 1 && !data.employment_status) ||
                                            (currentStep === 2 && data.employment_status === 'not_employed' && !data.unemployment_reason)
                                        }
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Submitting...' : '✅ Submit Survey'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppShell>
    );
}