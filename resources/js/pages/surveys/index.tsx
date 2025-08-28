import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Survey {
    id: number;
    survey_year: number;
    quarter: number;
    quarter_name: string;
    employment_status: string;
    employment_status_label: string;
    is_completed: boolean;
    submitted_at: string | null;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface PaginationLink {
    url: string | null;
    active: boolean;
    label: string;
}

interface PaginatedSurveys {
    data: Survey[];
    links: PaginationLink[];
    meta: {
        from: number;
        to: number;
        total: number;
    };
}

interface Props {
    surveys: PaginatedSurveys;
    filters: {
        year?: string;
        quarter?: string;
        employment_status?: string;
    };
    canCreate: boolean;
    [key: string]: unknown;
}

export default function SurveysIndex({ surveys, filters, canCreate }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    
    const handleFilter = (key: keyof typeof filters, value: string) => {
        const newFilters = { ...filters };
        if (value) {
            (newFilters as Record<string, string>)[key] = value;
        } else {
            delete (newFilters as Record<string, string>)[key];
        }
        
        router.get(route('surveys.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status: string, isCompleted: boolean) => {
        if (!isCompleted) {
            return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Draft</span>;
        }
        
        if (status === 'employed') {
            return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Employed</span>;
        }
        
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Not Employed</span>;
    };

    return (
        <AppShell>
            <Head title="Surveys" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            📊 Survey Responses
                        </h1>
                        <p className="text-gray-600">
                            {canCreate ? 'Manage your quarterly survey responses' : 'View and analyze alumni survey data'}
                        </p>
                    </div>
                    
                    {canCreate && (
                        <Link
                            href={route('surveys.create')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            + New Survey
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year
                            </label>
                            <select
                                value={filters.year || ''}
                                onChange={(e) => handleFilter('year', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">All Years</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
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
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Employment Status
                            </label>
                            <select
                                value={filters.employment_status || ''}
                                onChange={(e) => handleFilter('employment_status', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">All Statuses</option>
                                <option value="employed">Employed</option>
                                <option value="not_employed">Not Employed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Surveys List */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {surveys.data.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Period</th>
                                            {!canCreate && <th className="text-left py-3 px-4 font-medium text-gray-900">Alumni</th>}
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {surveys.data.map((survey) => (
                                            <tr key={survey.id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-gray-900">
                                                        {survey.quarter_name} {survey.survey_year}
                                                    </div>
                                                </td>
                                                {!canCreate && (
                                                    <td className="py-3 px-4">
                                                        <div className="text-sm">
                                                            <div className="font-medium text-gray-900">{survey.user?.name}</div>
                                                            <div className="text-gray-500">{survey.user?.email}</div>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="py-3 px-4">
                                                    {getStatusBadge(survey.employment_status, survey.is_completed)}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-500">
                                                    {survey.submitted_at 
                                                        ? new Date(survey.submitted_at).toLocaleDateString() 
                                                        : 'Not submitted'}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route('surveys.show', survey.id)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                        >
                                                            View
                                                        </Link>
                                                        {(canCreate || auth.user.role === 'admin') && (
                                                            <Link
                                                                href={route('surveys.edit', survey.id)}
                                                                className="text-green-600 hover:text-green-800 text-sm"
                                                            >
                                                                Edit
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {surveys.links && (
                                <div className="bg-gray-50 px-4 py-3 border-t">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-700">
                                            Showing {surveys.meta.from} to {surveys.meta.to} of {surveys.meta.total} results
                                        </p>
                                        <div className="flex space-x-1">
                                            {surveys.links.map((link, index: number) => (
                                                <button
                                                    key={index}
                                                    onClick={() => link.url && router.visit(link.url)}
                                                    disabled={!link.url}
                                                    className={`px-3 py-1 text-sm rounded ${
                                                        link.active 
                                                            ? 'bg-green-600 text-white' 
                                                            : link.url 
                                                                ? 'bg-white text-gray-700 hover:bg-gray-100' 
                                                                : 'text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">📋</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys found</h3>
                            <p className="text-gray-500 mb-4">
                                {canCreate 
                                    ? "You haven't submitted any surveys yet." 
                                    : "No survey responses match the current filters."}
                            </p>
                            {canCreate && (
                                <Link
                                    href={route('surveys.create')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Create Your First Survey
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}