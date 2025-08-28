import React, { useState, useEffect } from 'react';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface SlideData {
    title: string;
    description: string;
    image: string;
    bgColor: string;
}

const slides: SlideData[] = [
    {
        title: "📊 Alumni Career Tracking",
        description: "Monitor and analyze career progression of Magelang midwifery graduates through comprehensive quarterly surveys.",
        image: "🎓",
        bgColor: "bg-gradient-to-r from-green-400 to-green-600"
    },
    {
        title: "📈 Real-time Analytics",
        description: "Get instant insights on employment rates, salary trends, and career development with interactive dashboards.",
        image: "📊",
        bgColor: "bg-gradient-to-r from-emerald-400 to-emerald-600"
    },
    {
        title: "🏥 Healthcare Focus",
        description: "Specialized tracking for healthcare professionals with industry-specific metrics and career pathways.",
        image: "🏥",
        bgColor: "bg-gradient-to-r from-teal-400 to-teal-600"
    },
    {
        title: "🎯 Data-Driven Decisions",
        description: "Empower educational planning with comprehensive reports and statistical analysis of graduate outcomes.",
        image: "📋",
        bgColor: "bg-gradient-to-r from-green-500 to-green-700"
    }
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <>
            <Head title="Tracer Study - Magelang Midwifery Alumni">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
                {/* Navigation */}
                <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">M</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Magelang Midwifery</h1>
                                    <p className="text-sm text-green-600">Alumni Tracer Study</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex space-x-3">
                                        <Link
                                            href={route('login')}
                                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            🔐 Login
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="text-green-600 hover:text-green-700 px-6 py-3 rounded-lg border-2 border-green-600 hover:bg-green-50 transition-colors font-semibold"
                                        >
                                            Register as Alumni
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section with Slideshow */}
                <section className="relative h-[600px] overflow-hidden">
                    <div className="absolute inset-0">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${
                                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                                } ${slide.bgColor}`}
                            >
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                                        <div className="text-white">
                                            <h2 className="text-5xl font-bold mb-6 leading-tight">
                                                {slide.title}
                                            </h2>
                                            <p className="text-xl mb-8 text-white/90 leading-relaxed">
                                                {slide.description}
                                            </p>
                                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                                {!auth.user && (
                                                    <>
                                                        <Link
                                                            href={route('login')}
                                                            className="bg-white text-green-600 px-10 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center space-x-2"
                                                        >
                                                            <span>🔐</span>
                                                            <span>Login - All Users Welcome</span>
                                                        </Link>
                                                        <Link
                                                            href={route('register')}
                                                            className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg"
                                                        >
                                                            Register as Alumni
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-9xl mb-4">{slide.image}</div>
                                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                                                <p className="text-white font-medium text-lg">
                                                    Track • Analyze • Improve
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                    >
                        ←
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                    >
                        →
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </section>

                {/* User Access Section */}
                <section className="py-12 bg-green-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
                            <h3 className="text-3xl font-bold text-gray-900 mb-6">
                                🚪 Universal Access Portal
                            </h3>
                            <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto">
                                One login portal serves all user types. Whether you're an alumni, administrator, or faculty member (dosen), 
                                use the same <strong>Login</strong> button to access your personalized dashboard.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <div className="bg-blue-50 p-6 rounded-xl">
                                    <div className="text-3xl mb-3">👩‍🎓</div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Alumni</h4>
                                    <p className="text-sm text-gray-600">Complete surveys, track career progress, update profile information</p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-xl">
                                    <div className="text-3xl mb-3">👩‍💼</div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Administrators</h4>
                                    <p className="text-sm text-gray-600">Access reports, manage users, analyze employment data</p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-xl">
                                    <div className="text-3xl mb-3">👨‍🏫</div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Faculty (Dosen)</h4>
                                    <p className="text-sm text-gray-600">View academic outcomes, curriculum insights, student success metrics</p>
                                </div>
                            </div>
                            
                            <Link
                                href={route('login')}
                                className="bg-green-600 text-white px-12 py-4 rounded-lg hover:bg-green-700 transition-all duration-300 font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center space-x-3"
                            >
                                <span>🔐</span>
                                <span>Login - All User Types</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h3 className="text-4xl font-bold text-gray-900 mb-4">
                                Comprehensive Alumni Tracking System
                            </h3>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                A modern platform designed specifically for tracking career progression 
                                and employment outcomes of Magelang midwifery graduates.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-green-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="text-4xl mb-4">👩‍🎓</div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-3">Alumni Portal</h4>
                                <p className="text-gray-600">
                                    Easy-to-use interface for alumni to complete quarterly surveys and 
                                    track their career progress after graduation.
                                </p>
                            </div>
                            
                            <div className="bg-green-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="text-4xl mb-4">📊</div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-3">Analytics Dashboard</h4>
                                <p className="text-gray-600">
                                    Real-time insights and visualizations of employment trends, 
                                    salary data, and career progression patterns.
                                </p>
                            </div>
                            
                            <div className="bg-green-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="text-4xl mb-4">🎯</div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-3">Smart Reporting</h4>
                                <p className="text-gray-600">
                                    Automated reports and statistics to help improve curriculum 
                                    and better prepare future graduates.
                                </p>
                            </div>
                            
                            <div className="bg-green-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="text-4xl mb-4">🏥</div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-3">Healthcare Focus</h4>
                                <p className="text-gray-600">
                                    Specialized tracking for healthcare careers with industry-specific 
                                    metrics and relevance assessments.
                                </p>
                            </div>
                            
                            <div className="bg-green-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="text-4xl mb-4">🔒</div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h4>
                                <p className="text-gray-600">
                                    Advanced security measures to protect alumni data with 
                                    role-based access controls for different user types.
                                </p>
                            </div>
                            
                            <div className="bg-green-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="text-4xl mb-4">📱</div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-3">Mobile Friendly</h4>
                                <p className="text-gray-600">
                                    Responsive design ensures easy access from any device, 
                                    making survey completion convenient for busy alumni.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="py-16 bg-green-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold mb-2">500+</div>
                                <p className="text-green-100">Alumni Registered</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">85%</div>
                                <p className="text-green-100">Employment Rate</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">92%</div>
                                <p className="text-green-100">Healthcare Sector</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">4.2M</div>
                                <p className="text-green-100">Avg. Starting Salary</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                {!auth.user && (
                    <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
                        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                            <h3 className="text-3xl font-bold text-white mb-6">
                                Ready to Get Started? 📚
                            </h3>
                            <p className="text-xl text-green-100 mb-8">
                                Join our platform today! Alumni can register to participate in career tracking surveys, 
                                while administrators and faculty can request access through existing channels.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <Link
                                    href={route('login')}
                                    className="bg-white text-green-600 px-10 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center justify-center space-x-2"
                                >
                                    <span>🔐</span>
                                    <span>Login Now</span>
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="border-2 border-white text-white px-10 py-4 rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg inline-flex items-center justify-center space-x-2"
                                >
                                    <span>👩‍🎓</span>
                                    <span>Register as Alumni</span>
                                </Link>
                            </div>
                            <p className="text-green-200 text-sm mt-6">
                                💡 <strong>New here?</strong> Alumni can register directly. Administrators and faculty should contact IT support for account setup.
                            </p>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-300 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold">M</span>
                                    </div>
                                    <span className="font-semibold text-white">Magelang Midwifery</span>
                                </div>
                                <p className="text-sm">
                                    Tracking career success and improving education outcomes 
                                    for midwifery graduates.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                                <div className="space-y-2 text-sm">
                                    <p>About the Program</p>
                                    <p>Contact Support</p>
                                    <p>Privacy Policy</p>
                                    <p>Terms of Service</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-4">Contact Info</h4>
                                <div className="space-y-2 text-sm">
                                    <p>📍 Magelang, Central Java</p>
                                    <p>📧 info@magelangmidwifery.edu</p>
                                    <p>📞 (0293) 123-4567</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                            <p>&copy; 2024 Magelang Midwifery Alumni Tracer Study. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}