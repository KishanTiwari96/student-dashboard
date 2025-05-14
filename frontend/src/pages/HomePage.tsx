import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const { currentUser } = useAuth();
  const { displayName } = useUser();
  const [loading, setLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Get user display name or fallback to email
  const getUserDisplayName = () => {
    if (displayName) {
      return displayName;
    }
    return currentUser?.email?.split('@')[0] || '';
  };

  return (
    <div className="animate-fadeIn">
      {/* Hero Section with Wave Background */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 overflow-hidden min-h-[300px]">
        {/* Wave Background */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-white">
          <svg
            className="absolute bottom-0 w-full h-16 sm:h-20 text-white"
            viewBox="0 0 1440 120"
            fill="currentColor"
            preserveAspectRatio="none">
            <path d="M0,64L80,80C160,96,320,128,480,128C640,128,800,96,960,85.3C1120,75,1280,85,1360,90.7L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="max-w-3xl pb-4 sm:pb-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {currentUser
                ? <span>Welcome back, <span className="text-blue-200">{getUserDisplayName()}!</span></span>
                : 'Student Management Dashboard'}
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-indigo-100 max-w-3xl">
              A comprehensive platform designed to manage student records, track academic progress, and enhance educational outcomes.
            </p>
            {!currentUser && (
              <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Link to="/login" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    className="w-full shadow-lg hover:shadow-xl transition-shadow bg-white text-indigo-600 hover:bg-indigo-50"
                  >
                    Login to Dashboard
                  </Button>
                </Link>
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    className="w-full shadow-lg hover:shadow-xl transition-shadow bg-white text-indigo-600 hover:bg-indigo-50"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="hidden lg:block absolute top-12 right-12 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply opacity-20 animate-blob"></div>
        <div className="hidden lg:block absolute top-36 right-40 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000"></div>
        <div className="hidden lg:block absolute top-24 right-24 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000"></div>

        {/* Mobile Decorative Elements */}
        <div className="block lg:hidden absolute top-4 right-0 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply opacity-20 animate-blob"></div>
        <div className="block lg:hidden absolute -top-8 -right-10 w-28 h-28 bg-blue-400 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="py-8 sm:py-12 px-4 max-w-7xl mx-auto">
        {/* Quick Stats Dashboard */}
        {currentUser && (
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

            {loading ? (
              <div className="py-16">
                <Loader
                  variant="primary"
                  size="lg"
                  text="Loading dashboard data..."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow hover:border-blue-100">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Students</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">324</p>
                      </div>
                      <div className="rounded-full bg-blue-50 p-3 text-blue-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-green-500 font-medium flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                        <span>+8.1% this month</span>
                      </div>
                      <Link to="/students" className="text-xs text-blue-600 hover:text-blue-800 font-medium">View All</Link>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1"></div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow hover:border-green-100">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Active Courses</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">16</p>
                      </div>
                      <div className="rounded-full bg-green-50 p-3 text-green-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-indigo-500 font-medium flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>2 starting soon</span>
                      </div>
                      <a href="#" className="text-xs text-blue-600 hover:text-blue-800 font-medium">View All</a>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-1"></div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow hover:border-purple-100">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Average GPA</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">7.4/10</p>
                      </div>
                      <div className="rounded-full bg-purple-50 p-3 text-purple-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '74%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1.5 text-xs text-gray-500">
                        <span>Prev: 7.1</span>
                        <span>Target: 8.0</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-fuchsia-600 h-1"></div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow hover:border-amber-100">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">New This Month</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">27</p>
                      </div>
                      <div className="rounded-full bg-amber-50 p-3 text-amber-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center space-x-1">
                        <div className="flex-1 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '80%' }}></div>
                        </div>
                        <div className="flex-1 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <div className="flex-1 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        <div className="flex-1 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1.5">Weekly trend</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-1"></div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Main Menu Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group bg-white border border-gray-200 hover:border-blue-200 transition-all duration-300 overflow-hidden rounded-xl shadow-sm hover:shadow-md">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-300"></div>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4 group-hover:bg-blue-100 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Manage Students</h3>
                    <p className="text-gray-600 mt-1">View and edit student information</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500">Browse complete student records, filter by different criteria, and manage student details.</p>
                <div className="mt-6">
                  <Button
                    onClick={() => { }}
                    variant="primary"
                    className="w-full justify-center group-hover:bg-blue-700 transition-colors shadow-sm group-hover:shadow"
                    icon={
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    }
                  >
                    <Link to="/students" className="w-full">Browse Students</Link>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="group bg-white border border-gray-200 hover:border-green-200 transition-all duration-300 overflow-hidden rounded-xl shadow-sm hover:shadow-md">
              <div className="absolute top-0 left-0 w-2 h-full bg-green-500 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-300"></div>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4 group-hover:bg-green-100 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Add Student</h3>
                    <p className="text-gray-600 mt-1">Register a new student</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500">Add new students to the system with details like course enrollment, contact information, and academic data.</p>
                <div className="mt-6">
                  <Button
                    onClick={() => { }}
                    variant="success"
                    className="w-full justify-center group-hover:bg-green-700 transition-colors shadow-sm group-hover:shadow"
                    icon={
                      <svg className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    }
                    disabled={!currentUser}
                  >
                    <Link to="/add-student" className={`w-full ${!currentUser ? 'pointer-events-none' : ''}`}>Register Student</Link>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="group bg-white border border-gray-200 hover:border-purple-200 transition-all duration-300 overflow-hidden rounded-xl shadow-sm hover:shadow-md">
              <div className="absolute top-0 left-0 w-2 h-full bg-purple-500 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-300"></div>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4 group-hover:bg-purple-100 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">Account</h3>
                    <p className="text-gray-600 mt-1">Manage your profile</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500">Update your account settings, change password, and manage notification preferences.</p>
                <div className="mt-6">
                  {currentUser ? (
                    <Button
                      onClick={() => { }}
                      variant="info"
                      className="w-full justify-center group-hover:text-purple-100 group-hover:border-purple-400 transition-colors shadow-sm group-hover:shadow"
                      icon={
                        <svg className="w-4 h-4 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      }
                    >
                      <Link to="/profile">View Profile</Link>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => { }}
                      variant="info"
                      className="w-full justify-center text-purple-100 group-hover:border-purple-400 transition-colors shadow-sm group-hover:shadow"
                      icon={
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                      }
                    >
                      <Link to="/login">Sign In</Link>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </section>

        {!currentUser && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 p-5 mb-8 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2 mb-3 sm:mb-0">
                <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="sm:ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Login Required</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You need to be logged in to add or view detailed student information.
                    Create an account or sign in to access all dashboard features.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-3">
                    <Link to="/login" className="w-full xs:w-auto">
                      <Button
                        variant="warning"
                        size="sm"
                        className="w-full shadow-sm hover:shadow"
                        icon={
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                        }
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" className="w-full xs:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-yellow-800 border-yellow-300 hover:bg-yellow-50"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
