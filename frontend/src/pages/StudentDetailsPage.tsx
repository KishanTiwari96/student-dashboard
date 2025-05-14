import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Student } from '../components/StudentCard';
import { api } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';

const StudentDetailsPage = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login', { state: { from: `/student/${id}` } });
      return;
    }

    // Fetch student data
    const fetchStudent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await api.getStudentById(id);
        if (data) {
          setStudent(data);
        } else {
          setError('Student not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, currentUser, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const success = await api.deleteStudent(id);
      if (success) {
        navigate('/students');
      } else {
        setError('Failed to delete student.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while deleting the student.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6 sm:py-8 px-4 max-w-4xl mx-auto">
        <div className="text-center py-12 sm:py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="py-6 sm:py-8 px-4 max-w-4xl mx-auto">
        <Card className="bg-red-50 border-l-4 border-l-red-500">
          <div className="text-center py-6 sm:py-8">
            <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-4 text-lg sm:text-xl font-medium text-gray-900">{error || 'Student not found'}</h3>
            <div className="mt-6">
              <Button 
                onClick={() => navigate('/students')}
                variant="primary"
                className="text-sm sm:text-base"
                icon={
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to Students
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Function to determine GPA color based on value
  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.5) return 'bg-green-100 text-green-800';
    if (gpa >= 2.5) return 'bg-blue-100 text-blue-800';
    if (gpa >= 1.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <>
      <div className="py-6 sm:py-8 px-4 max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Student Profile</h1>
            <p className="text-sm sm:text-base text-gray-600">View and manage student information</p>
          </div>
          <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
            <Button 
              onClick={() => navigate('/students')}
              variant="outline"
              className="text-xs sm:text-sm"
              icon={
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }
            >
              Back to List
            </Button>
            <Button 
              onClick={() => setShowDeleteConfirm(true)}
              variant="danger"
              className="text-xs sm:text-sm"
              icon={
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            >
              Delete Student
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="md:col-span-1">
            <Card className="overflow-hidden text-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-5 sm:py-6 text-white">
                <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img 
                    src={student.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&size=300&background=random&bold=true`} 
                    alt={`${student.name}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold">{student.name}</h2>
                <p className="opacity-75 text-sm sm:text-base">{student.email}</p>
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {student.gpa && (
                    <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${getGpaColor(student.gpa)}`}>
                      GPA: {student.gpa.toFixed(1)}
                    </div>
                  )}
                  <div className="bg-indigo-100 text-indigo-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                    {student.course}
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-3 sm:pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-xs sm:text-sm">Student ID:</span>
                    <span className="font-medium text-xs sm:text-sm truncate max-w-[150px]">{student.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs sm:text-sm">Enrolled On:</span>
                    <span className="font-medium text-xs sm:text-sm">{student.enrollmentDate}</span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6">
                  <Button 
                    variant="outline"
                    fullWidth
                    className="text-xs sm:text-sm"
                    icon={
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    }
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="mb-4 sm:mb-6 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3">
                <h3 className="text-base sm:text-lg font-medium text-gray-800">Academic Information</h3>
              </div>
              <div className="p-3 sm:p-5">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Program</h4>
                    <p className="text-sm sm:text-base text-gray-800 font-medium">{student.course}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Enrollment Status</h4>
                    <div className="bg-green-100 text-green-800 py-0.5 sm:py-1 px-2 rounded inline-flex items-center text-xs sm:text-sm">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Active
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Academic Level</h4>
                    <p className="text-sm sm:text-base text-gray-800">Undergraduate</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Expected Graduation</h4>
                    <p className="text-sm sm:text-base text-gray-800">May 2024</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="mb-4 sm:mb-6 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3">
                <h3 className="text-base sm:text-lg font-medium text-gray-800">Contact Information</h3>
              </div>
              <div className="p-3 sm:p-5">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Email Address</h4>
                    <p className="text-sm sm:text-base text-gray-800 break-words">{student.email}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Phone Number</h4>
                    <p className="text-sm sm:text-base text-gray-800">(555) 123-4567</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Mailing Address</h4>
                    <p className="text-sm sm:text-base text-gray-800">
                      123 University Way<br />
                      Collegetown, CA 94321
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Emergency Contact</h4>
                    <p className="text-sm sm:text-base text-gray-800">John Doe - (555) 987-6543</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${student.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default StudentDetailsPage;
