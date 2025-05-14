import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import StudentsPage from './pages/StudentsPage';
import StudentDetailsPage from './pages/StudentDetailsPage';
import AddStudentPage from './pages/AddStudentPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
              <Navbar />
              <main className="pt-20 flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/students" element={<StudentsPage />} />
                  <Route 
                    path="/student/:id" 
                    element={
                      <ProtectedRoute>
                        <StudentDetailsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/add-student" 
                    element={
                      <ProtectedRoute>
                        <AddStudentPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
