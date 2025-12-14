import React, { useState } from 'react';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('검색어:', searchQuery);
    // 나중에 검색 로직 추가
  };

  return (
    <div className="search-page">
      <h1>찾아보기</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="영화 제목을 입력하세요"
        />
        <button type="submit">검색</button>
      </form>
      <div className="search-results">
        {/* 나중에 검색 결과 추가 */}
      </div>
    </div>
  );
}

export default Search;