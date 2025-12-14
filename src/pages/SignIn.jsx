import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { tryLogin, tryRegister } from '../utils/auth';
import './SignIn.css';
import { useState, useEffect } from 'react';

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
  const [submitted, setSubmitted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 미들웨어: 로그인 상태 확인 및 리다이렉트
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

  // 이메일 형식 검증
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    // 아이디(이메일) 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다';
    }

    // 회원가입 추가 검증
    if (!isLogin) {
      // 비밀번호 확인
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      }

      // 약관 동의 (필수)
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = '약관에 동의해주세요';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 로그인/회원가입 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(true);
    
    // 폼 유효성 검사
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
          
          // Remember Me 기능: 이메일 저장
          if (formData.rememberMe) {
            localStorage.setItem('savedEmail', formData.email);
          } else {
            localStorage.removeItem('savedEmail');
          }

          // 로그인 상태 저장
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', formData.email);
          
          // 로그인 성공 메시지
          toast.success(`환영합니다, ${formData.email}님!`, {
            duration: 3000,
            position: 'top-center',
            icon: '👋',
          });
          
          // 메인 페이지로 이동
          setTimeout(() => {
            navigate('/');
          }, 500);
        },
        (error) => {
          setIsLoading(false);
          toast.error(error || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.', {
            duration: 4000,
            position: 'top-center',
          });
        }
      );
    } else {
      // 회원가입 처리
      tryRegister(
        formData.email,
        formData.password,
        (user) => {
          setIsLoading(false);
          
          toast.success('회원가입이 완료되었습니다! 로그인 화면으로 이동합니다.', {
            duration: 3000,
            position: 'top-center',
            icon: '🎉',
          });
          
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
          toast.error(error || '회원가입에 실패했습니다. 다시 시도해주세요.', {
            duration: 4000,
            position: 'top-center',
          });
        }
      );
    }
  };

  // 로그인/회원가입 모드 전환 (팬시한 애니메이션 효과)
  const toggleMode = () => {
    // 전환 애니메이션 시작
    setIsTransitioning(true);
    
    // 300ms 후에 실제 모드 전환 (flipOut 애니메이션 중간 지점)
    setTimeout(() => {
      setIsLogin(!isLogin);
      setErrors({});
      setSubmitted(false);
      setFormData(prev => ({
        ...prev,
        confirmPassword: '',
        agreeTerms: false
      }));
      
      // 전환 완료 후 transitioning 상태 해제
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  return (
    <div className="signin-container">
      {/* 배경 애니메이션 */}
      <div className="signin-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* 로그인/회원가입 카드 */}
      <div className={`signin-card ${isLogin ? 'login-mode' : 'register-mode'} ${isTransitioning ? 'transitioning' : ''}`}>
        <div className="card-inner">
          {/* 헤더 */}
          <div className="card-header">
            <h1 className="card-title">{isLogin ? '로그인' : '회원가입'}</h1>
            <p className="card-subtitle">
              {isLogin 
                ? '다시 만나서 반갑습니다! 로그인 정보를 입력해주세요.' 
                : '새로운 계정을 만들어 시작하세요.'}
            </p>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="signin-form">
            {/* 1. 아이디(이메일) 입력 */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {isLogin ? '아이디 또는 이메일' : '이메일'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder={isLogin ? '아이디 또는 이메일' : '이메일'}
                autoComplete="email"
              />
              <span className="error-message">
                {submitted && errors.email ? errors.email : ''}
              </span>
            </div>

            {/* 2. 비밀번호 입력 */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                비밀번호 {!isLogin && <span className="label-hint">(TMDB API 키)</span>}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder={isLogin ? "비밀번호" : "비밀번호 (TMDB API 키)"}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <span className="error-message">
                {submitted && errors.password ? errors.password : ''}
              </span>
            </div>

            {/* 3. 비밀번호 확인 입력 (회원가입 시에만) */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="비밀번호 확인"
                  autoComplete="new-password"
                />
                <span className="error-message">
                  {submitted && errors.confirmPassword ? errors.confirmPassword : ''}
                </span>
              </div>
            )}

            {/* 4. 옵션 (Remember Me / 약관 동의) */}
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
                    <span className="checkbox-text">아이디 저장</span>
                  </label>
                  <button type="button" className="link-button">
                    비밀번호 찾기
                  </button>
                </>
              ) : (
                <div style={{ width: '100%' }}>
                  <label className="checkbox-label full-width">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className={`checkbox-input ${errors.agreeTerms ? 'error' : ''}`}
                    />
                    <span className="checkbox-text">
                      <a href="#" className="inline-link" onClick={(e) => e.preventDefault()}>
                        이용약관
                      </a>에 동의합니다
                    </span>
                  </label>
                  <span className="error-message">
                    {submitted && errors.agreeTerms ? errors.agreeTerms : ''}
                  </span>
                </div>
              )}
            </div>

            {/* 5. 제출 버튼 */}
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                isLogin ? '로그인' : '회원가입'
              )}
            </button>
          </form>

          {/* 푸터 */}
          <div className="card-footer">
            <p className="footer-text">
              {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
              <button 
                type="button" 
                onClick={toggleMode} 
                className="toggle-button"
              >
                {isLogin ? '회원가입' : '로그인'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

