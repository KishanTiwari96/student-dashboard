import type { Student } from '../components/StudentCard';

// Sample data to simulate API responses
const studentData: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    course: 'Computer Science',
    enrollmentDate: '2023-09-01',
    gpa: 9.2,
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    course: 'Business Administration',
    enrollmentDate: '2023-09-01',
    gpa: 8.5,
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    course: 'Electrical Engineering',
    enrollmentDate: '2023-09-01',
    gpa: 8.2,
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    course: 'Psychology',
    enrollmentDate: '2023-09-01',
    gpa: 7.9,
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    course: 'Computer Science',
    enrollmentDate: '2023-09-01',
    gpa: 7.7,
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '6',
    name: 'Sarah Thompson',
    email: 'sarah.thompson@example.com',
    course: 'Mathematics',
    enrollmentDate: '2023-09-01',
    gpa: 7.0,
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
  },
  {
    id: '7',
    name: 'David Martinez',
    email: 'david.martinez@example.com',
    course: 'Physics',
    enrollmentDate: '2023-09-01',
    gpa: 6.6,
    avatarUrl: 'https://i.pravatar.cc/150?img=7',
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    course: 'Business Administration',
    enrollmentDate: '2023-09-01',
    gpa: 6.4,
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
  }
];

// Mock API functions with setTimeout to simulate async behavior
export const api = {
  // Get all students
  getStudents: (): Promise<Student[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...studentData]);
      }, 800);
    });
  },

  // Get student by ID
  getStudentById: (id: string): Promise<Student | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const student = studentData.find(s => s.id === id);
        resolve(student);
      }, 500);
    });
  },

  // Add a new student
  addStudent: (student: Omit<Student, 'id'>): Promise<Student> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newStudent = {
          ...student,
          id: (studentData.length + 1).toString()
        };
        studentData.push(newStudent);
        resolve(newStudent);
      }, 500);
    });
  },

  // Update a student
  updateStudent: (id: string, updates: Partial<Omit<Student, 'id'>>): Promise<Student | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = studentData.findIndex(s => s.id === id);
        if (index !== -1) {
          studentData[index] = { ...studentData[index], ...updates };
          resolve(studentData[index]);
        } else {
          resolve(undefined);
        }
      }, 500);
    });
  },

  // Delete a student
  deleteStudent: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = studentData.findIndex(s => s.id === id);
        if (index !== -1) {
          studentData.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },

  // Filter students by course
  filterStudentsByCourse: (course: string): Promise<Student[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredStudents = studentData.filter(s => 
          course === 'All' ? true : s.course === course
        );
        resolve(filteredStudents);
      }, 300);
    });
  },

  // Get all available courses
  getCourses: (): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const courses = ['All', ...new Set(studentData.map(s => s.course))];
        resolve(courses);
      }, 300);
    });
  }
}; 