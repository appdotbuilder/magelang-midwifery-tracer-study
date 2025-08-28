import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Survey {
    id: number;
    survey_year: number;
    quarter: number;
    quarter_name: string;
    employment_status: string;
    employment_status_label: string;
    unemployment_reason?: string;
    months_to_get_job?: number;
    job_type?: string;
    work_field?: string;
    employer_name?: string;
    job_start_date?: string;
    how_found_job?: string;
    position?: string;
    work_relevance?: string;
    first_salary?: number;
    is_completed: boolean;
    submitted_at?: string;
    user?: {
        id: number;
        name: string;
        email: string;
        enrollment_year?: string;
        graduation_year?: string;
    };
}

interface Props {
    survey: Survey;
    canEdit: boolean;
    [key: string]: unknown;
}

export default function ShowSurvey({ survey, canEdit }: Props) {
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getLabel = (key: string, value?: string) => {
        const labels: Record<string, Record<string, string>> = {
            job_type: {
                'private': 'Private Sector',
                'government': 'Government/Public Sector'
            },
            work_field: {
                'healthcare': 'Healthcare',
                'non_healthcare': 'Non-Healthcare'
            },
            how_found_job: {
                'job_portal': 'Job Portal/Website',
                'social_media': 'Social Media',
                'referral': 'Referral/Recommendation',
                'direct_application': 'Direct Application',
                'recruitment_event': 'Recruitment Event',
                'other': 'Other'
            },
            work_relevance: {
                'very_relevant': '🎯 Very Relevant',
                'relevant': '✅ Relevant',
                'somewhat_relevant': '⚡ Somewhat Relevant',
                'not_relevant': '❌ Not Relevant'
            }
        };
        
        return labels[key]?.[value || ''] || value || 'N/A';
    };

    const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">{title}</h3>
            {children}
        </div>
    );

    const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-gray-600 font-medium">{label}:</span>
            <span className="text-gray-900">{value}</span>
        </div>
    );

    return (
        <AppShell>
            <Head title={`Survey - ${survey.quarter_name} ${survey.survey_year}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('surveys.index')}
                            className="text-green-600 hover:text-green-700"
                        >
                            ← Back to Surveys
                        </Link>
                    </div>
                    
                    {canEdit && (
                        <Link
                            href={route('surveys.edit', survey.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            ✏️ Edit Survey
                        </Link>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            📊 Survey Details
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {survey.quarter_name} {survey.survey_year} Survey Response
                        </p>
                    </div>
                    
                    <div className="text-right">
                        {survey.is_completed ? (
                            <div className="flex items-center space-x-2">
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    ✅ Completed
                                </span>
                                <span className="text-sm text-gray-500">
                                    {formatDate(survey.submitted_at)}
                                </span>
                            </div>
                        ) : (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                📝 Draft
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Alumni Information */}
                    {survey.user && (
                        <InfoCard title="👤 Alumni Information">
                            <div className="space-y-2">
                                <InfoRow label="Name" value={survey.user.name} />
                                <InfoRow label="Email" value={survey.user.email} />
                                <InfoRow label="Enrollment Year" value={survey.user.enrollment_year || 'N/A'} />
                                <InfoRow label="Graduation Year" value={survey.user.graduation_year || 'N/A'} />
                            </div>
                        </InfoCard>
                    )}

                    {/* Survey Period */}
                    <InfoCard title="📅 Survey Period">
                        <div className="space-y-2">
                            <InfoRow label="Year" value={survey.survey_year} />
                            <InfoRow label="Quarter" value={survey.quarter_name} />
                            <InfoRow 
                                label="Employment Status" 
                                value={
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        survey.employment_status === 'employed' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {survey.employment_status === 'employed' ? '💼 Employed' : '🔍 Job Seeking'}
                                    </span>
                                }
                            />
                        </div>
                    </InfoCard>

                    {/* Employment Status */}
                    <InfoCard title={survey.employment_status === 'employed' ? '💼 Employment Details' : '🔍 Unemployment Status'}>
                        {survey.employment_status === 'employed' ? (
                            <div className="space-y-2">
                                <InfoRow label="Time to Get Job" value={`${survey.months_to_get_job || 0} months`} />
                                <InfoRow label="Job Type" value={getLabel('job_type', survey.job_type)} />
                                <InfoRow label="Work Field" value={getLabel('work_field', survey.work_field)} />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="py-2">
                                    <span className="text-gray-600 font-medium">Reason:</span>
                                    <div className="mt-2 p-3 bg-gray-50 rounded text-gray-900 text-sm">
                                        {survey.unemployment_reason || 'Not specified'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </InfoCard>
                </div>

                {/* Employment Details (for employed alumni) */}
                {survey.employment_status === 'employed' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <InfoCard title="🏢 Job Information">
                            <div className="space-y-2">
                                <InfoRow label="Employer" value={survey.employer_name || 'N/A'} />
                                <InfoRow label="Position" value={survey.position || 'N/A'} />
                                <InfoRow label="Start Date" value={formatDate(survey.job_start_date)} />
                                <InfoRow label="How Found Job" value={getLabel('how_found_job', survey.how_found_job)} />
                            </div>
                        </InfoCard>

                        <InfoCard title="💰 Salary & Relevance">
                            <div className="space-y-2">
                                <InfoRow 
                                    label="First Salary" 
                                    value={survey.first_salary ? formatCurrency(survey.first_salary) : 'N/A'} 
                                />
                                <InfoRow 
                                    label="Work Relevance" 
                                    value={getLabel('work_relevance', survey.work_relevance)} 
                                />
                            </div>
                        </InfoCard>
                    </div>
                )}

                {/* Summary Card */}
                <InfoCard title="📋 Survey Summary">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-center">
                            <div className="text-4xl mb-2">
                                {survey.employment_status === 'employed' ? '🎉' : '💪'}
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                {survey.employment_status === 'employed' 
                                    ? 'Employment Achieved' 
                                    : 'Actively Job Seeking'
                                }
                            </h4>
                            <p className="text-gray-600 text-sm">
                                {survey.employment_status === 'employed' 
                                    ? `Successfully employed at ${survey.employer_name || 'a company'} in the ${getLabel('work_field', survey.work_field).toLowerCase()} sector.`
                                    : 'Currently seeking employment opportunities. Keep up the great work!'
                                }
                            </p>
                        </div>
                    </div>
                </InfoCard>

                {/* Action Buttons */}
                {canEdit && (
                    <div className="flex justify-center space-x-4 pt-4">
                        <Link
                            href={route('surveys.edit', survey.id)}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            ✏️ Edit Survey
                        </Link>
                        <Link
                            href={route('surveys.index')}
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            📋 View All Surveys
                        </Link>
                    </div>
                )}
            </div>
        </AppShell>
    );
}