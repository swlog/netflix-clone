# 🎬 Netflix Clone - React SPA 프로젝트

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Netflix와 유사한 프론트엔드 데모 사이트입니다. React.js를 활용한 Single Page Application(SPA)으로 개발되었으며, TMDB API를 통해 실시간 영화 정보를 제공합니다.

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [설치 및 실행](#-설치-및-실행)
- [프로젝트 구조](#-프로젝트-구조)
- [페이지 설명](#-페이지-설명)
- [배포](#-배포)
- [개발 가이드](#-개발-가이드)

## 🎯 프로젝트 소개

본 프로젝트는 최신 프론트엔드 기술을 활용하여 Netflix와 유사한 영화 스트리밍 플랫폼의 UI/UX를 구현한 데모 사이트입니다.

### 개발 목적

- 최신 프론트엔드 프레임워크(React.js) 습득
- SPA(Single Page Application) 개발 경험
- REST API 연동 및 비동기 데이터 처리
- 반응형 웹 디자인 구현
- GitHub Pages를 통한 정적 웹사이트 배포

## ✨ 주요 기능

### 1. 인증 시스템
- 이메일 기반 회원가입/로그인
- TMDB API Key를 비밀번호로 활용
- Remember Me 기능 (자동 로그인)
- Local Storage 기반 세션 관리

### 2. 영화 탐색
- **홈 페이지**: 다양한 카테고리별 영화 목록 (인기, 현재 상영중, 최고 평점, 개봉 예정, 액션)
- **대세 콘텐츠**: 테이블 뷰 / 무한 스크롤 뷰 전환 기능
- **찾아보기**: 장르별 필터링 및 정렬 기능
- **위시리스트**: 내가 찜한 영화 목록 관리

### 3. 인터랙티브 UI/UX
- 영화 포스터 호버 효과 (확대 애니메이션)
- 위시리스트 토글 기능 (하트 아이콘)
- 로딩 애니메이션 (3D 필름릴 효과)
- 부드러운 페이지 전환 효과
- Toast 알림 시스템

### 4. 반응형 디자인
- 모바일, 태블릿, 데스크톱 대응
- 터치 이벤트 지원
- 미디어 쿼리를 통한 레이아웃 최적화

## 🛠 기술 스택

### Frontend
- **React** (v19.2.0) - UI 라이브러리
- **React Router DOM** (v7.10.1) - SPA 라우팅
- **Axios** (v1.13.2) - HTTP 클라이언트
- **React Hot Toast** (v2.6.0) - 알림 시스템

### Styling
- **CSS3** - 커스텀 스타일링
- **CSS Animations** - 페이지 전환 및 UI 효과
- **FontAwesome** (v7.1.0) - 아이콘

### API
- **TMDB API** - 영화 정보 제공

### Development Tools
- **Create React App** (v5.0.1) - 프로젝트 셋업
- **Node.js** - 런타임 환경
- **npm** - 패키지 관리

### Deployment
- **GitHub Pages** - 정적 웹사이트 호스팅
- **gh-pages** (v6.3.0) - 배포 자동화

## 🚀 설치 및 실행

### 필수 요구사항

- Node.js (v14 이상)
- npm (v6 이상)
- TMDB API Key

### TMDB API Key 발급

1. [TMDB 웹사이트](https://www.themoviedb.org) 회원가입
2. 계정 설정 → API → API Key 발급
3. 발급받은 API Key를 로그인 시 비밀번호로 사용

### 설치 방법

```bash
# 1. 저장소 클론
git clone https://github.com/swlog/netflix-clone.git
cd netflix-clone

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm start

# 4. 빌드
npm run build
```

### npm 명령어

| 명령어 | 설명 |
|--------|------|
| `npm start` | 개발 서버 실행 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm test` | 테스트 실행 |
| `npm run eject` | CRA 설정 커스터마이징 (비가역적) |
| `npm run deploy` | GitHub Pages에 배포 |

## 📁 프로젝트 구조

```
├── src/                      
│   ├── components/           # 재사용 가능한 컴포넌트
│   │   ├── common/          # 공통 컴포넌트
│   │   │   ├── ProtectedRoute.jsx  # 인증 라우트 가드
│   │   │       
│   │   ├── Header.jsx              # 헤더 네비게이션
│   │   ├── Header.css
│   │   ├── Hero.jsx                # 히어로 배너
│   │   ├── Hero.css
│   │   ├── MovieCard.jsx           # 영화 카드
│   │   ├── MovieCard.css
│   │   ├── Loading.jsx
│   │   └── Loading.css
│   │
│   ├── pages/                # 페이지 컴포넌트
│   │   ├── Home.jsx         # 홈 페이지
│   │   ├── Home.css
│   │   ├── SignIn.jsx       # 로그인/회원가입
│   │   ├── SignIn.css
│   │   ├── Popular.jsx      # 대세 콘텐츠
│   │   ├── Popular.css
│   │   ├── Search.jsx       # 찾아보기
│   │   ├── Search.css
│   │   ├── Wishlist.jsx     # 위시리스트
│   │   └── Wishlist.css
│   │
│   ├── services/             # API 서비스
│   │   ├── tmdb.js          # TMDB API 연동
│   │   └── auth.js          # 인증 서비스
│   │
│   ├── hooks/                # Custom Hooks
│   │   └── useWishlist.js   # 위시리스트 관리
│   │
│   ├── utils/                # 유틸리티 함수
│   │   └── constants.js     # 상수 정의
│   │
│   ├── App.js               # 메인 App 컴포넌트
│   ├── App.css              # 전역 스타일
│   ├── index.js             
│   └── index.css           
│
├── package.json              # 프로젝트 설정
├── package-lock.json         # 의존성 잠금
└── README.md                 # 프로젝트 문서
```

### 주요 디렉토리 설명

#### `/components`
재사용 가능한 UI 컴포넌트들을 포함합니다.
- `common/`: 전역적으로 사용되는 공통 컴포넌트
- 각 컴포넌트는 JSX 파일과 CSS 파일로 구성

#### `/pages`
라우팅되는 페이지 레벨 컴포넌트들을 포함합니다.
- 각 페이지는 독립적인 기능과 스타일을 가집니다

#### `/services`
외부 API 및 비즈니스 로직을 처리합니다.
- TMDB API 호출 함수
- 인증 관련 로직

#### `/hooks`
커스텀 React Hook으로 로직 재사용성을 높입니다.
- `useWishlist`: 위시리스트 상태 관리

## 📱 페이지 설명

### 1. 로그인/회원가입 (`/signin`)

**주요 기능:**
- 이메일 형식 검증
- TMDB API Key를 비밀번호로 활용
- Remember Me 체크박스
- 회원가입 시 약관 동의
- 로그인-회원가입 전환 애니메이션

**Local Storage 저장 항목:**
- `users`: 가입된 사용자 목록
- `currentUser`: 현재 로그인한 사용자 정보
- `isLoggedIn`: 로그인 상태
- `TMDb-Key`: API 키

### 2. 홈 페이지 (`/`)

**주요 기능:**
- 히어로 배너 (자동 슬라이드)
- 5개 카테고리 영화 슬라이더
  - 인기 영화 (Popular)
  - 현재 상영중 (Now Playing)
  - 최고 평점 (Top Rated)
  - 개봉 예정 (Upcoming)
  - 액션 영화 (Action)
- 좌우 스크롤 네비게이션
- 위시리스트 토글

**API 엔드포인트:**
```javascript
- /movie/popular
- /movie/now_playing
- /movie/top_rated
- /movie/upcoming
- /discover/movie?with_genres=28 (액션)
```

### 3. 대세 콘텐츠 (`/popular`)

**주요 기능:**
- **테이블 뷰**: 페이지네이션 (6개씩)
- **무한 스크롤 뷰**: Intersection Observer 활용
- 뷰 모드 전환 버튼
- 맨 위로 가기 버튼
- 동적 페이지 번호 표시

**구현 특징:**
- Intersection Observer API로 무한 스크롤 구현
- 페이지 전환 시 자동 스크롤 상단 이동
- 로딩 상태 표시

### 4. 찾아보기 (`/search`)

**주요 기능:**
- 장르별 필터링 (다중 선택 가능)
- 평점 범위 필터
- 정렬 옵션 (인기순, 평점순, 최신순)
- 필터 초기화 버튼
- 테이블 뷰 / 무한 스크롤 뷰

**필터 옵션:**
```javascript
장르: 액션, 모험, 애니메이션, 코미디, 범죄, 다큐멘터리, 
     드라마, 가족, 판타지, 역사, 공포, 음악, 미스터리, 
     로맨스, SF, TV 영화, 스릴러, 전쟁, 서부
평점: 6~9점 
정렬: popularity.desc, vote_average.desc, release_date.desc
```

### 5. 위시리스트 (`/wishlist`)

**주요 기능:**
- Local Storage에 저장된 찜한 영화 표시
- 그리드 레이아웃
- 위시리스트에서 제거 기능
- 빈 상태 UI

**Local Storage 구조:**
```json
{
  "movieWishlist": [
    {
      "id": 123,
      "title": "영화 제목",
      "poster_path": "/path/to/poster.jpg",
      "vote_average": 8.5
    }
  ]
}
```

## 🌐 배포

### GitHub Pages 자동 배포

본 프로젝트는 GitHub Pages를 통해 배포되며, `gh-pages` 패키지를 사용하여 자동화되어 있습니다.

**배포 명령어:**
```bash
npm run deploy
```

**배포 과정:**
1. `npm run build`로 프로덕션 빌드 생성
2. `build` 폴더를 `gh-pages` 브랜치에 푸시
3. GitHub Pages가 자동으로 호스팅

**배포 URL:**
```
https://swlog.github.io/netflix-clone
```

### 배포 설정

`package.json`에 다음 설정이 필요합니다:

```json
{
  "homepage": "https://swlog.github.io/netflix-clone",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

## 👨‍💻 개발 가이드

### Git Flow 브랜치 전략

본 프로젝트는 Git Flow 전략을 따릅니다:

```
main          ──────────────────────────────
              ↑                             ↑
develop       ─────────────┬────────────────
                           ↑        ↑
feature/*                  └────────┘
```

- **main**: 프로덕션 배포 브랜치
- **develop**: 개발 통합 브랜치
- **feature/***: 기능 개발 브랜치

### 커밋 메시지 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 업무 수정, 패키지 매니저 수정
```

### 코딩 컨벤션

#### JavaScript/React
- 함수형 컴포넌트 사용
- Hooks 활용 (useState, useEffect, useCallback, useMemo 등)
- 컴포넌트 파일명: PascalCase (예: `MovieCard.jsx`)
- 함수/변수명: camelCase (예: `handleClick`, `isLoading`)
- 상수: UPPER_SNAKE_CASE (예: `VIEW_MODES`, `API_KEY`)

#### CSS
- BEM 명명법 기반 클래스명
- 컴포넌트별 CSS 파일 분리
- 전역 스타일은 `App.css` 또는 `index.css`에 작성

### 주요 Custom Hook

#### useWishlist
위시리스트 상태 관리를 위한 훅

```javascript
const { 
  wishlist,           // 위시리스트 배열
  isInWishlist,       // 영화가 위시리스트에 있는지 확인
  toggleWishlist,     // 위시리스트 토글
  clearWishlist       // 위시리스트 초기화
} = useWishlist();
```

### 주요 서비스 함수

#### TMDB 서비스 (`services/tmdb.js`)

```javascript
// 인기 영화 가져오기
tmdbService.getPopularMovies(page)

// 현재 상영중인 영화
tmdbService.getNowPlayingMovies(page)

// 최고 평점 영화
tmdbService.getTopRatedMovies(page)

// 개봉 예정 영화
tmdbService.getUpcomingMovies(page)

// 장르별 영화
tmdbService.getMoviesByGenre(genreId, page)

// 검색
tmdbService.searchMovies(query, page)

// 필터링된 영화 검색
tmdbService.discoverMovies({ genre, rating, sort, page })
```

## 🎨 주요 CSS 애니메이션

### 1. 페이지 전환 애니메이션
```css
@keyframes netflixTransition {
  0% {
    opacity: 0;
    transform: translateX(50px) scale(0.95);
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
    filter: blur(0);
  }
}
```

### 2. 영화 카드 호버 효과
- Transform scale(1.05)
- Box-shadow 강화
- Transition duration: 0.3s

### 3. 로딩 애니메이션
- 3D 회전 필름릴
- 프로그레스 바
- 점 애니메이션

### 4. 로그인/회원가입 전환 효과
- 3D rotateY 애니메이션
- Perspective 활용
- Backface visibility

## 📊 Local Storage 활용

본 프로젝트는 Local Storage를 적극 활용하여 데이터를 관리합니다:

| Key | 설명 | 데이터 타입 |
|-----|------|------------|
| `users` | 가입된 사용자 목록 | Array<Object> |
| `currentUser` | 현재 로그인 사용자 | Object |
| `isLoggedIn` | 로그인 상태 | Boolean (string) |
| `TMDb-Key` | TMDB API 키 | String |
| `movieWishlist` | 찜한 영화 목록 | Array<Object> |
| `rememberMe` | 자동 로그인 여부 | Boolean (string) |

### 데이터 구조 예시

```javascript
// users
[
  {
    "id": "user@example.com",
    "email": "user@example.com",
    "password": "YOUR_TMDB_API_KEY"
  }
]

// movieWishlist
[
  {
    "id": 550,
    "title": "Fight Club",
    "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "vote_average": 8.4
  }
]
```

## 🔒 인증 및 보안

### Protected Route
- `ProtectedRoute` 컴포넌트로 인증되지 않은 접근 차단
- 로그인하지 않은 사용자는 자동으로 `/signin`으로 리디렉션

### API Key 관리
- TMDB API Key는 사용자 비밀번호로 활용
- Local Storage에 안전하게 저장
- 각 API 요청 시 헤더에 포함

## 🐛 알려진 이슈 및 제한사항

1. **Local Storage 기반 인증**
   - 실제 프로덕션 환경에서는 백엔드 인증 시스템 필요
   - 브라우저 개발자 도구로 접근 가능

2. **TMDB API 제한**
   - API 요청 횟수 제한 (분당 40회)
   - 페이지당 최대 500페이지까지 조회 가능

3. **반응형 디자인**
   - 극단적인 화면 크기에서 일부 레이아웃 조정 필요

## 📝 라이센스

MIT License

## 📚 참고 자료

- [React 공식 문서](https://react.dev/)
- [TMDB API 문서](https://developers.themoviedb.org/3)
- [React Router 문서](https://reactrouter.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Note**: 본 프로젝트는 교육 목적으로 제작되었으며, Netflix의 실제 서비스와는 무관합니다.