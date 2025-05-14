import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Student } from '../components/StudentCard';
import { api } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';

type StudentFormData = Omit<Student, 'id'>;
type FormErrors = Partial<Record<keyof StudentFormData | 'form', string>>;

const AddStudentPage = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    course: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    gpa: undefined,
    avatarUrl: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login', { state: { from: '/add-student' } });
      return;
    }

    // Fetch available courses
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await api.getCourses();
        setCourses(coursesData.filter(course => course !== 'All'));
        if (coursesData.length > 1) {
          setFormData(prev => ({ ...prev, course: coursesData[1] })); // Set first actual course
        }
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gpa' ? (value ? parseFloat(value) : undefined) : value
    }));

    // Clear error when field is edited
    if (errors[name as keyof StudentFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.course) {
      newErrors.course = 'Course is required';
    }
    
    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = 'Enrollment date is required';
    }
    
    if (formData.gpa !== undefined && (formData.gpa < 0 || formData.gpa > 10.0)) {
      newErrors.gpa = 'GPA must be between 0 and 10.0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      const newStudent = await api.addStudent(formData);
      navigate(`/student/${newStudent.id}`);
    } catch (err) {
      console.error('Failed to add student', err);
      setErrors(prev => ({
        ...prev,
        form: 'Failed to add student. Please try again.'
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Student</h1>
        <p className="text-gray-600">Create a new student record</p>
      </div>

      {loading ? (
        <Card>
          <div className="animate-pulse p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Name skeleton */}
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
              {/* Email skeleton */}
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
              {/* Course skeleton */}
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
              {/* Enrollment Date skeleton */}
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
              {/* GPA skeleton */}
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
              {/* Avatar URL skeleton */}
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-4">
              <div className="h-10 w-24 bg-gray-200 rounded" />
              <div className="h-10 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit}>
            {errors.form && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{errors.form}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <InputField
                id="name"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter student's full name"
                required
                error={errors.name}
              />
              <InputField
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter student's email address"
                required
                error={errors.email}
              />
              <div className="mb-4">
                <label htmlFor="course" className="block text-gray-700 text-sm font-bold mb-1">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border ${
                    errors.course ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="" disabled>Select a course</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
                {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course}</p>}
              </div>
              <InputField
                id="enrollmentDate"
                name="enrollmentDate"
                label="Enrollment Date"
                type="date"
                value={formData.enrollmentDate}
                onChange={handleChange}
                required
                error={errors.enrollmentDate}
              />
              <div className="mb-4">
                <label htmlFor="gpa" className="block text-gray-700 text-sm font-bold mb-1">
                  GPA (0-10.0)
                </label>
                <input
                  id="gpa"
                  name="gpa"
                  type="number"
                  value={formData.gpa?.toString() || ''}
                  onChange={handleChange}
                  placeholder="Enter student's GPA"
                  step="0.1"
                  min="0"
                  max="10.0"
                  className={`w-full px-3 py-2 border ${
                    errors.gpa ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.gpa && <p className="text-red-500 text-xs mt-1">{errors.gpa}</p>}
              </div>
              <InputField
                id="avatarUrl"
                name="avatarUrl"
                label="Avatar URL"
                type="url"
                value={formData.avatarUrl || ''}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                error={errors.avatarUrl}
              />
            </div>
            <div className="flex items-center justify-end space-x-3">
              <Button 
                onClick={() => navigate('/students')}
                variant="secondary"
                type="button"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="primary"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Add Student'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default AddStudentPage;
