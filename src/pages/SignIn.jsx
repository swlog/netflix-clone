<<<<<<< HEAD
import React, { useState } from 'react';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('로그인 시도:', email, password);
    // 나중에 로그인 로직 추가
  };

  return (
    <div className="signin-page">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이메일:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
          />
        </div>
        <div>
          <label>비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}
=======
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { tryLogin, tryRegister } from '../utils/auth';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 이미 로그인되어 있으면 홈으로 리다이렉트
    const apiKey = localStorage.getItem('TMDb-Key');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (apiKey && isLoggedIn === 'true') {
      navigate('/');
    }

    // Remember Me로 저장된 이메일 불러오기
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다';
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      }

      if (!formData.agreeTerms) {
        newErrors.agreeTerms = '약관에 동의해주세요';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // 입력 시 해당 필드의 에러 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    if (isLogin) {
      // 로그인 처리
      tryLogin(
        formData.email,
        formData.password,
        (user) => {
          setIsLoading(false);
          
          // Remember Me 처리
          if (formData.rememberMe) {
            localStorage.setItem('savedEmail', formData.email);
          } else {
            localStorage.removeItem('savedEmail');
          }

          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', formData.email);
          
          toast.success(`환영합니다, ${formData.email}님!`);
          
          setTimeout(() => {
            navigate('/');
          }, 500);
        },
        (error) => {
          setIsLoading(false);
          toast.error(error || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        }
      );
    } else {
      // 회원가입 처리
      tryRegister(
        formData.email,
        formData.password,
        (user) => {
          setIsLoading(false);
          toast.success('회원가입이 완료되었습니다!');
          
          // 회원가입 후 자동으로 로그인 화면으로 전환
          setTimeout(() => {
            setIsLogin(true);
            setFormData(prev => ({
              ...prev,
              confirmPassword: '',
              agreeTerms: false
            }));
          }, 1000);
        },
        (error) => {
          setIsLoading(false);
          toast.error(error || '회원가입에 실패했습니다.');
        }
      );
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData(prev => ({
      ...prev,
      confirmPassword: '',
      agreeTerms: false
    }));
  };

  return (
    <div className="signin-container">
      <div className="signin-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className={`signin-card ${isLogin ? 'login-mode' : 'register-mode'}`}>
        <div className="card-inner">
          <div className="card-header">
            <h1 className="card-title">{isLogin ? 'Sign in' : 'Sign up'}</h1>
            <p className="card-subtitle">
              {isLogin ? 'Welcome back! Please enter your details.' : 'Create your account to get started.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="signin-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Username or Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                autoComplete="email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            )}

            <div className="form-options">
              {isLogin ? (
                <>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Remember me</span>
                  </label>
                  <button type="button" className="link-button">
                    Forgot Password?
                  </button>
                </>
              ) : (
                <label className="checkbox-label full-width">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className={`checkbox-input ${errors.agreeTerms ? 'error' : ''}`}
                  />
                  <span className="checkbox-text">
                    I agree to the <a href="#" className="inline-link">Terms and Conditions</a>
                  </span>
                </label>
              )}
            </div>
            {!isLogin && errors.agreeTerms && (
              <span className="error-message">{errors.agreeTerms}</span>
            )}

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                isLogin ? 'LOGIN' : 'SIGN UP'
              )}
            </button>
          </form>

          <div className="card-footer">
            <p className="footer-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button" 
                onClick={toggleMode} 
                className="toggle-button"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
>>>>>>> 636ff70f304275f9eb024e8194fdd7aad234a293

export default SignIn;