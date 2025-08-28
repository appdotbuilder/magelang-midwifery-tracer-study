import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface DashboardStats {
    totalSurveys?: number;
    completedSurveys?: number;
    currentQuarter?: string;
    employmentRate?: number;
    totalAlumni?: number;
    activeResponses?: number;
}

interface Props {
    stats?: DashboardStats;
    recentSurveys?: Array<{
        id: number;
        survey_year: number;
        quarter: number;
        employment_status: string;
        is_completed: boolean;
    }>;
    [key: string]: unknown;
}

export default function Dashboard({ stats = {}, recentSurveys = [] }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string; role: string; profile_completed: boolean } } }>().props;
    const user = auth.user;

    const QuickActionCard = ({ icon, title, description, href, color = 'green' }: {
        icon: string;
        title: string;
        description: string;
        href: string;
        color?: string;
    }) => (
        <Link
            href={href}
            className={`block p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow border-l-4 border-l-${color}-500`}
        >
            <div className="flex items-center mb-3">
                <div className="text-3xl mr-3">{icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <p className="text-gray-600">{description}</p>
        </Link>
    );

    const StatCard = ({ icon, value, label, color = 'blue' }: {
        icon: string;
        value: string | number;
        label: string;
        color?: string;
    }) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
                <div>
                    <div className={`text-2xl font-bold text-${color}-600 mb-1`}>{value}</div>
                    <div className="text-sm text-gray-600">{label}</div>
                </div>
                <div className="text-3xl">{icon}</div>
            </div>
        </div>
    );

    // Alumni Dashboard
    if (user.role === 'alumni') {
        return (
            <AppShell>
                <Head title="Alumni Dashboard" />
                
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back, {user.name}! 👋
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Track your career progress with quarterly surveys.
                            </p>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon="📝"
                            value={stats.totalSurveys || 0}
                            label="Total Surveys"
                            color="blue"
                        />
                        <StatCard
                            icon="✅"
                            value={stats.completedSurveys || 0}
                            label="Completed Surveys"
                            color="green"
                        />
                        <StatCard
                            icon="📅"
                            value={stats.currentQuarter || 'Q4 2024'}
                            label="Current Period"
                            color="purple"
                        />
                        <StatCard
                            icon="🎯"
                            value={user.profile_completed ? 'Complete' : 'Incomplete'}
                            label="Profile Status"
                            color={user.profile_completed ? 'green' : 'orange'}
                        />
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <QuickActionCard
                                icon="📝"
                                title="New Survey"
                                description="Submit your quarterly career survey"
                                href={route('surveys.create')}
                                color="green"
                            />
                            <QuickActionCard
                                icon="📊"
                                title="My Surveys"
                                description="View and manage your survey responses"
                                href={route('surveys.index')}
                                color="blue"
                            />
                            <QuickActionCard
                                icon="⚙️"
                                title="Profile Settings"
                                description="Update your personal information"
                                href={route('profile.edit')}
                                color="gray"
                            />
                        </div>
                    </div>

                    {/* Recent Surveys */}
                    {recentSurveys.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Surveys</h2>
                            <div className="bg-white rounded-lg shadow-sm border">
                                <div className="divide-y divide-gray-100">
                                    {recentSurveys.slice(0, 3).map((survey) => (
                                        <div key={survey.id} className="p-4 flex items-center justify-between">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    Q{survey.quarter} {survey.survey_year}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {survey.employment_status === 'employed' ? '💼 Employed' : '🔍 Job Seeking'}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                {survey.is_completed ? (
                                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                        Completed
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                                        Draft
                                                    </span>
                                                )}
                                                <Link
                                                    href={route('surveys.show', survey.id)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </AppShell>
        );
    }

    // Admin & Dosen Dashboard
    return (
        <AppShell>
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {user.role === 'admin' ? '🛠️ Admin Dashboard' : '👨‍🏫 Lecturer Dashboard'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Monitor and analyze alumni career progression data.
                        </p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon="👩‍🎓"
                        value={stats.totalAlumni || 0}
                        label="Total Alumni"
                        color="blue"
                    />
                    <StatCard
                        icon="📝"
                        value={stats.activeResponses || 0}
                        label="Active Responses"
                        color="green"
                    />
                    <StatCard
                        icon="💼"
                        value={stats.employmentRate ? `${stats.employmentRate}%` : 'N/A'}
                        label="Employment Rate"
                        color="emerald"
                    />
                    <StatCard
                        icon="📊"
                        value={stats.totalSurveys || 0}
                        label="Total Surveys"
                        color="purple"
                    />
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <QuickActionCard
                            icon="📈"
                            title="Analytics & Reports"
                            description="View comprehensive employment analytics"
                            href={route('reports.index')}
                            color="green"
                        />
                        <QuickActionCard
                            icon="📋"
                            title="All Surveys"
                            description="Manage alumni survey responses"
                            href={route('surveys.index')}
                            color="blue"
                        />
                        {user.role === 'admin' && (
                            <QuickActionCard
                                icon="👥"
                                title="User Management"
                                description="Manage alumni and user accounts"
                                href="#"
                                color="purple"
                            />
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                📊 Current Quarter Status
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Survey Period:</span>
                                    <span className="font-medium">{stats.currentQuarter || 'Q4 2024'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Response Rate:</span>
                                    <span className="font-medium text-green-600">
                                        {stats.totalAlumni && stats.activeResponses 
                                            ? Math.round((stats.activeResponses / stats.totalAlumni) * 100)
                                            : 0}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Employment Rate:</span>
                                    <span className="font-medium text-blue-600">
                                        {stats.employmentRate || 0}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                🎯 Key Insights
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <p className="text-gray-600">
                                        Most alumni find employment within 3-6 months
                                    </p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <p className="text-gray-600">
                                        Healthcare sector remains the primary employer
                                    </p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                    <p className="text-gray-600">
                                        High work relevance to midwifery skills reported
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}