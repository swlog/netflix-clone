import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Popular from './pages/Popular';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
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

        <Routes>
          <Route path="/signin" element={<SignIn />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Header />
                <Home />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/popular"
            element={
              <ProtectedRoute>
                <Header />
                <Popular />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Header />
                <Search />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Header />
                <Wishlist />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;