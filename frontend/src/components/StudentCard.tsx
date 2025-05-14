import { Link } from 'react-router-dom';
import Card from './Card';

export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  enrollmentDate: string;
  gpa?: number;
  avatarUrl?: string;
}

interface StudentCardProps {
  student: Student;
  onClick?: (student: Student) => void;
}

const StudentCard = ({ student, onClick }: StudentCardProps) => {
  const handleClick = () => {
    if (onClick) onClick(student);
  };

  // Function to determine GPA color based on value
  const getGpaColor = (gpa: number) => {
    if (gpa >= 7.5) return {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      icon: 'text-green-500',
      label: 'Excellent'
    };
    if (gpa >= 6.5) return {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
      icon: 'text-blue-500',
      label: 'Good'
    };
    if (gpa >= 5.5) return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      icon: 'text-yellow-500',
      label: 'Average'
    };
    return {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      icon: 'text-red-500',
      label: 'Needs Improvement'
    };
  };

  // Determine border color based on student's course
  const getBorderColor = () => {
    const courseColors: Record<string, string> = {
      'Computer Science': 'border-blue-500',
      'Engineering': 'border-purple-500',
      'Business': 'border-amber-500',
      'Arts': 'border-pink-500',
      'Mathematics': 'border-emerald-500',
      'Physics': 'border-cyan-500',
      'Chemistry': 'border-yellow-500',
      'Biology': 'border-lime-500'
    };
    
    return courseColors[student.course] || 'border-indigo-500';
  };

  const gpaInfo = student.gpa ? getGpaColor(student.gpa) : null;
  const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 ${getBorderColor()} bg-white group overflow-hidden`} 
      onClick={handleClick}
    >
      <div className="flex flex-col sm:flex-row sm:items-center p-3 sm:p-1">
        {/* Student Avatar - Smaller on mobile, aligned center */}
        <div className="flex-shrink-0 relative mx-auto sm:mx-0 mb-3 sm:mb-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-blue-100 group-hover:border-blue-300 transition-colors duration-300 shadow-md">
            {student.avatarUrl ? (
              <img 
                src={student.avatarUrl} 
                alt={`${student.name}'s avatar`} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 text-white text-lg font-bold">
                {initials}
              </div>
            )}
          </div>
          {gpaInfo && (
            <div className={`absolute -bottom-1 -right-1 h-6 w-6 sm:h-7 sm:w-7 rounded-full ${gpaInfo.bg} ${gpaInfo.border} border-2 flex items-center justify-center ${gpaInfo.icon} shadow-sm`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}
        </div>

        {/* Student Info - Centered on mobile */}
        <div className="flex-1 min-w-0 py-0 sm:py-2 sm:ml-4 text-center sm:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{student.name}</h3>
              <p className="text-gray-600 truncate flex items-center justify-center sm:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-xs sm:text-sm">{student.email}</span>
              </p>
            </div>
            <div className="mt-2 md:mt-0 flex justify-center sm:justify-start md:justify-end">
              {student.gpa && (
                <div className="flex flex-col items-center md:items-end">
                  <div className="flex items-center">
                    <span className={`text-xs font-semibold ${gpaInfo?.text}`}>{gpaInfo?.label}</span>
                    <div className="ml-2 flex items-center bg-gray-100 rounded-full h-4 sm:h-5 w-14 sm:w-16 overflow-hidden">
                      <div 
                        className={`h-full ${gpaInfo?.bg}`} 
                        style={{ width: `${(student.gpa / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-0.5 sm:mt-1">GPA: {student.gpa.toFixed(1)}/10</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 sm:mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
            <span className="bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-800 text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center border border-indigo-200 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" />
              </svg>
              {student.course}
            </span>

            <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center border border-blue-100 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {student.enrollmentDate}
            </span>
          </div>
        </div>

        {/* Action Button - Centered on mobile */}
        <div className="flex-shrink-0 flex justify-center mt-3 sm:mt-0 sm:self-stretch sm:flex sm:flex-col sm:justify-between sm:items-end sm:py-2">
          <div className="h-2 w-2 rounded-full bg-green-500 ring-2 ring-green-100 hidden sm:block self-start md:self-end"></div>

          <Link 
            to={`/student/${student.id}`}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-white border border-blue-200 text-blue-600 hover:text-white hover:bg-blue-600 text-xs sm:text-sm font-medium transition-colors shadow-sm hover:shadow group-hover:border-blue-400"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mr-1">View Details</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-3.5 sm:w-3.5 transform group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default StudentCard; 