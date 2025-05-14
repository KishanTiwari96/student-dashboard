import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StudentCard from '../components/StudentCard';
import type { Student } from '../components/StudentCard';
import { api } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Load students and courses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch students
        const studentsData = await api.getStudents();
        setStudents(studentsData);
        setFilteredStudents(studentsData);
        
        // Fetch available courses
        const coursesData = await api.getCourses();
        setCourses(coursesData);
      } catch (err) {
        setError('Failed to load student data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle course filter change
  const handleCourseChange = async (course: string) => {
    setSelectedCourse(course);
    try {
      setLoading(true);
      const filtered = await api.filterStudentsByCourse(course);
      setFilteredStudents(filtered);
    } catch (err) {
      setError('Failed to filter students.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      // If search is cleared, revert to course filter only
      handleCourseChange(selectedCourse);
      return;
    }
    
    // Filter based on both course and search term
    const results = students.filter((student) => {
      const matchesCourse = selectedCourse === 'All' || student.course === selectedCourse;
      const matchesSearch = student.name.toLowerCase().includes(value.toLowerCase()) || 
                           student.email.toLowerCase().includes(value.toLowerCase());
      return matchesCourse && matchesSearch;
    });
    
    setFilteredStudents(results);
  };

  const handleStudentClick = (student: Student) => {
    if (currentUser) {
      navigate(`/student/${student.id}`);
    } else {
      navigate('/login', { state: { from: `/student/${student.id}` } });
    }
  };

  return (
    <div className="py-6 sm:py-8 px-4 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <span className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 shadow-md">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            Students Directory
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and track all your students in one place</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 rounded-lg text-sm sm:text-base">
            <div className="text-blue-900 font-medium">{students.length}</div>
            <div className="text-blue-700 ml-1 font-medium">Students</div>
          </div>
          <Button 
            onClick={() => navigate('/add-student')}
            variant="primary"
            disabled={!currentUser}
            className="transition-transform hover:scale-105 shadow-md text-sm sm:text-base"
            icon={
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Add Student
          </Button>
        </div>
      </div>

      {/* Filter controls */}
      <Card className="mb-6 sm:mb-8 shadow-md border-t-4 border-blue-500 overflow-hidden transition-all duration-300">
        <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-white flex justify-between items-center cursor-pointer"
             onClick={() => setIsFilterExpanded(!isFilterExpanded)}>
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Search & Filter</h2>
          </div>
          <svg 
            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transform transition-transform duration-300 ${isFilterExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ${isFilterExpanded ? 'max-h-96' : 'max-h-0'}`}>
          <div className="p-4 sm:p-5 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="sm:col-span-1 lg:col-span-2">
                <label htmlFor="search-filter" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Search Students:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search-filter"
                    className="block w-full pl-9 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="course-filter" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Filter by Course:
                </label>
                <select
                  id="course-filter"
                  value={selectedCourse}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all text-sm sm:text-base"
                >
                  <option value="All">All Courses</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-100">
              <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-1 sm:gap-0 mb-2 sm:mb-0">
                <span className="font-medium text-blue-600 mr-1">{filteredStudents.length}</span>
                <span className="mr-1">results found</span>
                <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
                  {selectedCourse !== 'All' && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {selectedCourse}
                    </span>
                  )}
                  {searchTerm && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      "{searchTerm}"
                    </span>
                  )}
                </div>
              </div>
              {(selectedCourse !== 'All' || searchTerm) && (
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    handleCourseChange('All');
                  }}
                  variant="outline"
                  size="sm"
                  icon={
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  }
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Students list */}
      {loading ? (
        <div className="text-center py-16 sm:py-20">
          <Loader 
            variant="primary" 
            size="xl" 
            text="Loading students data..." 
            className="py-8 sm:py-10"
          />
        </div>
      ) : error ? (
        <Card className="bg-red-50 border border-red-200 shadow-md animate-fadeIn">
          <div className="flex items-center p-4">
            <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-base sm:text-lg font-medium text-red-800">Error Loading Data</h3>
              <p className="text-xs sm:text-sm text-red-700 mt-1">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                variant="danger"
                size="sm"
                className="mt-3"
                icon={
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                }
              >
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      ) : filteredStudents.length === 0 ? (
        <Card className="text-center py-12 sm:py-16 bg-gray-50 shadow-md animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-5">
            <svg className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No Students Found</h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto mb-5 sm:mb-6 px-4">
            We couldn't find any students matching your current search criteria. Try adjusting your filters or add a new student.
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
            <Button 
              onClick={() => {
                setSearchTerm('');
                handleCourseChange('All');
              }}
              variant="outline"
              className="text-sm"
              icon={
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Reset Filters
            </Button>
            {currentUser && (
              <Button 
                onClick={() => navigate('/add-student')}
                variant="primary"
                className="text-sm"
                icon={
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                Add Student
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {filteredStudents.map((student, index) => (
              <div 
                key={student.id} 
                className="transform transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <StudentCard 
                  student={student} 
                  onClick={handleStudentClick}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {!currentUser && filteredStudents.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 p-3 sm:p-4 mt-6 sm:mt-8 rounded-md shadow-md animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="flex items-start sm:items-center mb-3 sm:mb-0">
              <div className="flex-shrink-0 bg-yellow-100 rounded-full p-1">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-yellow-800">Login Required</h3>
                <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                  You need to be logged in to view detailed student information or add new students.
                </p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              variant="warning"
              size="sm"
              className="sm:ml-2 whitespace-nowrap text-xs sm:text-sm"
              icon={
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              }
            >
              Login Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage; 