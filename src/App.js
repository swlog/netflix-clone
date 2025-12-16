import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Popular from './pages/Popular';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import './App.css';
import './components/Header.css'
import './pages/Home.css';
import './pages/SignIn.css';
import './pages/Search.css';
import './pages/Popular.css';
import './pages/Wishlist.css';

function AppRoutes() {
  const location = useLocation();
  
  return (
    <div className="page-transition-wrapper">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#46d369',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#e50914',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes location={location} key={location.pathname}>
        <Route path="/signin" element={
          <div className="page-wrapper fade-in">
            <SignIn />
          </div>
        } />
        
        <Route path="/" element={
          <ProtectedRoute> 
            <div className="page-wrapper fade-in">
              <Header />
              <Home />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/popular" element={
          <ProtectedRoute>
            <div className="page-wrapper fade-in">
              <Header />
              <Popular />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/search" element={
          <ProtectedRoute>
            <div className="page-wrapper fade-in">
              <Header />
              <Search />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <div className="page-wrapper fade-in">
              <Header />
              <Wishlist />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;