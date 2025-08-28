import React from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Props {
    employmentStats: {
        total: number;
        employed: number;
        unemployed: number;
        employment_rate: number;
    };
    jobTypeStats: Record<string, number>;
    workFieldStats: Record<string, number>;
    salaryStats: {
        average: number;
        minimum: number;
        maximum: number;
        count: number;
        ranges: Record<string, number>;
    };
    timeToJobStats: {
        average: number;
        minimum: number;
        maximum: number;
        ranges: Record<string, number>;
    };
    workRelevanceStats: Record<string, number>;
    howFoundJobStats: Record<string, number>;
    quarterlyTrends: Record<string, {
        employed: number;
        unemployed: number;
        total: number;
        employment_rate: number;
    }>;
    alumniOverview: {
        total_alumni: number;
        completed_profiles: number;
        active_responses: number;
        profile_completion_rate: number;
        response_rate: number;
    };
    filters: {
        year: string;
        quarter?: string;
    };
    availableYears: number[];
    [key: string]: unknown;
}

export default function ReportsIndex({ 
    employmentStats, 
    jobTypeStats, 
    workFieldStats, 
    salaryStats,
    timeToJobStats,
    workRelevanceStats,
    howFoundJobStats,
    quarterlyTrends,
    alumniOverview,
    filters,
    availableYears
}: Props) {
    
    const handleFilter = (key: keyof typeof filters, value: string) => {
        const newFilters = { ...filters };
        if (value) {
            (newFilters as Record<string, string>)[key] = value;
        } else {
            delete (newFilters as Record<string, string>)[key];
        }
        
        router.get(route('reports.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const StatCard = ({ icon, title, value, subtitle, color = 'green' }: {
        icon: string;
        title: string;
        value: string | number;
        subtitle?: string;
        color?: string;
    }) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{icon}</div>
                <div className={`text-2xl font-bold text-${color}-600`}>
                    {value}
                    {typeof value === 'number' && title.includes('Rate') && '%'}
                </div>
            </div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
    );

    const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            {children}
        </div>
    );

    const ProgressBar = ({ label, value, total, color = 'green' }: {
        label: string;
        value: number;
        total: number;
        color?: string;
    }) => {
        const percentage = total > 0 ? (value / total) * 100 : 0;
        return (
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-medium">{value} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className={`bg-${color}-500 h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <AppShell>
            <Head title="Analytics & Reports" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Analytics & Reports</h1>
                    <p className="text-gray-600">
                        Comprehensive insights into alumni employment outcomes and career progression.
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year
                            </label>
                            <select
                                value={filters.year}
                                onChange={(e) => handleFilter('year', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                {availableYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quarter
                            </label>
                            <select
                                value={filters.quarter || ''}
                                onChange={(e) => handleFilter('quarter', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">All Quarters</option>
                                <option value="1">Q1 (Jan-Mar)</option>
                                <option value="2">Q2 (Apr-Jun)</option>
                                <option value="3">Q3 (Jul-Sep)</option>
                                <option value="4">Q4 (Oct-Dec)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Alumni Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatCard
                        icon="👩‍🎓"
                        title="Total Alumni"
                        value={alumniOverview.total_alumni}
                        color="blue"
                    />
                    <StatCard
                        icon="✅"
                        title="Profile Completion Rate"
                        value={alumniOverview.profile_completion_rate}
                        subtitle={`${alumniOverview.completed_profiles} completed`}
                    />
                    <StatCard
                        icon="📝"
                        title="Survey Response Rate"
                        value={alumniOverview.response_rate}
                        subtitle={`${alumniOverview.active_responses} respondents`}
                    />
                    <StatCard
                        icon="💼"
                        title="Employment Rate"
                        value={employmentStats.employment_rate}
                        subtitle={`${employmentStats.employed}/${employmentStats.total} employed`}
                    />
                    <StatCard
                        icon="💰"
                        title="Avg Starting Salary"
                        value={salaryStats.count > 0 ? formatCurrency(salaryStats.average) : 'N/A'}
                        subtitle={salaryStats.count > 0 ? `from ${salaryStats.count} responses` : 'No data'}
                        color="emerald"
                    />
                </div>

                {/* Employment Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="📈 Employment Status">
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <div className="text-4xl font-bold text-green-600 mb-2">
                                    {employmentStats.employment_rate}%
                                </div>
                                <p className="text-gray-600">Employment Rate</p>
                            </div>
                            
                            <ProgressBar 
                                label="Employed"
                                value={employmentStats.employed}
                                total={employmentStats.total}
                                color="green"
                            />
                            <ProgressBar 
                                label="Not Employed"
                                value={employmentStats.unemployed}
                                total={employmentStats.total}
                                color="red"
                            />
                        </div>
                    </ChartCard>

                    <ChartCard title="🏢 Job Type Distribution">
                        <div className="space-y-4">
                            {Object.entries(jobTypeStats).map(([type, count]) => (
                                <ProgressBar
                                    key={type}
                                    label={type === 'private' ? 'Private Sector' : 'Government/Public'}
                                    value={count}
                                    total={Object.values(jobTypeStats).reduce((sum, val) => sum + val, 0)}
                                    color={type === 'private' ? 'blue' : 'purple'}
                                />
                            ))}
                            {Object.keys(jobTypeStats).length === 0 && (
                                <p className="text-gray-500 text-center py-4">No data available</p>
                            )}
                        </div>
                    </ChartCard>
                </div>

                {/* Work Field and Relevance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="🏥 Work Field Distribution">
                        <div className="space-y-4">
                            {Object.entries(workFieldStats).map(([field, count]) => (
                                <ProgressBar
                                    key={field}
                                    label={field === 'healthcare' ? 'Healthcare' : 'Non-Healthcare'}
                                    value={count}
                                    total={Object.values(workFieldStats).reduce((sum, val) => sum + val, 0)}
                                    color={field === 'healthcare' ? 'green' : 'orange'}
                                />
                            ))}
                            {Object.keys(workFieldStats).length === 0 && (
                                <p className="text-gray-500 text-center py-4">No data available</p>
                            )}
                        </div>
                    </ChartCard>

                    <ChartCard title="🎯 Work Relevance to Skills">
                        <div className="space-y-4">
                            {Object.entries(workRelevanceStats).map(([relevance, count]) => {
                                const labels: Record<string, string> = {
                                    'very_relevant': 'Very Relevant',
                                    'relevant': 'Relevant',
                                    'somewhat_relevant': 'Somewhat Relevant',
                                    'not_relevant': 'Not Relevant'
                                };
                                const colors: Record<string, string> = {
                                    'very_relevant': 'green',
                                    'relevant': 'blue',
                                    'somewhat_relevant': 'yellow',
                                    'not_relevant': 'red'
                                };
                                
                                return (
                                    <ProgressBar
                                        key={relevance}
                                        label={labels[relevance] || relevance}
                                        value={count}
                                        total={Object.values(workRelevanceStats).reduce((sum, val) => sum + val, 0)}
                                        color={colors[relevance] || 'gray'}
                                    />
                                );
                            })}
                            {Object.keys(workRelevanceStats).length === 0 && (
                                <p className="text-gray-500 text-center py-4">No data available</p>
                            )}
                        </div>
                    </ChartCard>
                </div>

                {/* Salary Analysis */}
                <ChartCard title="💰 Salary Analysis">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-4">Salary Statistics</h4>
                            {salaryStats.count > 0 ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Average:</span>
                                        <span className="font-medium">{formatCurrency(salaryStats.average)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Minimum:</span>
                                        <span className="font-medium">{formatCurrency(salaryStats.minimum)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Maximum:</span>
                                        <span className="font-medium">{formatCurrency(salaryStats.maximum)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sample Size:</span>
                                        <span className="font-medium">{salaryStats.count} responses</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No salary data available</p>
                            )}
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-gray-900 mb-4">Salary Ranges</h4>
                            <div className="space-y-3">
                                {Object.entries(salaryStats.ranges).map(([range, count]) => (
                                    <ProgressBar
                                        key={range}
                                        label={range}
                                        value={count}
                                        total={Object.values(salaryStats.ranges).reduce((sum, val) => sum + val, 0)}
                                        color="emerald"
                                    />
                                ))}
                                {Object.keys(salaryStats.ranges).length === 0 && (
                                    <p className="text-gray-500">No data available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </ChartCard>

                {/* Time to Employment and Job Search */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="⏱️ Time to Employment">
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {timeToJobStats.average} months
                                </div>
                                <p className="text-gray-600">Average time to get first job</p>
                            </div>
                            
                            {Object.entries(timeToJobStats.ranges).map(([range, count]) => (
                                <ProgressBar
                                    key={range}
                                    label={range}
                                    value={count}
                                    total={Object.values(timeToJobStats.ranges).reduce((sum, val) => sum + val, 0)}
                                    color="blue"
                                />
                            ))}
                            {Object.keys(timeToJobStats.ranges).length === 0 && (
                                <p className="text-gray-500 text-center py-4">No data available</p>
                            )}
                        </div>
                    </ChartCard>

                    <ChartCard title="🔍 How Alumni Found Jobs">
                        <div className="space-y-4">
                            {Object.entries(howFoundJobStats).map(([method, count]) => {
                                const labels: Record<string, string> = {
                                    'job_portal': 'Job Portal/Website',
                                    'social_media': 'Social Media',
                                    'referral': 'Referral/Recommendation',
                                    'direct_application': 'Direct Application',
                                    'recruitment_event': 'Recruitment Event',
                                    'other': 'Other'
                                };
                                
                                return (
                                    <ProgressBar
                                        key={method}
                                        label={labels[method] || method}
                                        value={count}
                                        total={Object.values(howFoundJobStats).reduce((sum, val) => sum + val, 0)}
                                        color="indigo"
                                    />
                                );
                            })}
                            {Object.keys(howFoundJobStats).length === 0 && (
                                <p className="text-gray-500 text-center py-4">No data available</p>
                            )}
                        </div>
                    </ChartCard>
                </div>

                {/* Quarterly Trends */}
                <ChartCard title="📅 Quarterly Employment Trends ({filters.year})">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(quarter => {
                            const trend = quarterlyTrends[quarter] || { employed: 0, unemployed: 0, total: 0, employment_rate: 0 };
                            return (
                                <div key={quarter} className="text-center p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Q{quarter}</h4>
                                    <div className="text-2xl font-bold text-green-600 mb-1">
                                        {trend.employment_rate}%
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {trend.employed}/{trend.total} employed
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </ChartCard>
            </div>
        </AppShell>
    );
}