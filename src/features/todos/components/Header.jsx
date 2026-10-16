import { useState, useEffect } from 'react';
import { Sparkles, Clock, Calendar } from 'lucide-react';

const Header = ({ totalCount, completedCount }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Korean date: 2026년 8월 11일 화요일
  const formattedDate = time.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  // Format Korean time: 오후 09:17:29
  const formattedTime = time.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="header-section">
      <div className="header-badge">
        <Sparkles size={16} />
        <span>솜사탕처럼 포근한 하루</span>
      </div>

      <h1 className="header-title">
        <span className="title-icon">☁️</span>
        오늘의 Todo List
        <span className="title-icon">🌸</span>
      </h1>

      {/* Live Clock */}
      <div className="clock-box">
        <div className="clock-date">
          <Calendar size={18} style={{ color: 'var(--cotton-pink-deep)' }} />
          <span>{formattedDate}</span>
        </div>
        <div className="clock-divider"></div>
        <div className="clock-time">
          <Clock size={18} style={{ color: 'var(--cotton-purple-deep)' }} />
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Today's Progress Stats */}
      <div className="progress-card">
        <div className="progress-info">
          <span>
            오늘의 달성율 ({completedCount}/{totalCount})
          </span>
          <span className="percent-tag">{percentage}% 완료!</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
