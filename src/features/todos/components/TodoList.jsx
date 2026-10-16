import { Search, X, ArrowUpDown } from 'lucide-react';
import TodoItem from './TodoItem';

const TodoList = ({
  todos,
  search,
  setSearch,
  filter,
  setFilter,
  sortOrder,
  setSortOrder,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onClearCompleted,
}) => {
  return (
    <div className="list-section">
      {/* Search & Filter Controls */}
      <div className="controls-row">
        {/* Search Bar (검색인풋) */}
        <div className="search-box">
          <Search size={18} style={{ color: 'var(--text-light)' }} />
          <input
            type="text"
            className="search-input"
            placeholder="할 일 검색하기..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearch('')}
              title="검색어 초기화"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Tabs & Sort Toggle */}
        <div className="filter-bar">
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              전체
            </button>
            <button
              type="button"
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              진행중
            </button>
            <button
              type="button"
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              완료
            </button>
          </div>

          <button
            type="button"
            className="sort-btn"
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            title="정렬 순서 변경"
          >
            <ArrowUpDown size={14} />
            <span>{sortOrder === 'newest' ? '최신순' : '오래된순'}</span>
          </button>
        </div>
      </div>

      {/* Todo Items List */}
      <div className="todo-items-list">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggleTodo}
              onDelete={onDeleteTodo}
              onEdit={onEditTodo}
            />
          ))
        ) : (
          <div className="empty-state">
            <span className="empty-cloud-icon">☁️</span>
            <div className="empty-title">
              {search ? '검색된 할 일이 없습니다' : '아직 등록된 할 일이 없어요!'}
            </div>
            <div className="empty-subtitle">
              {search ? '다른 검색어로 찾아보세요 🌸' : '위의 입력창에 솜사탕처럼 포근한 할 일을 적어보세요 ✨'}
            </div>
          </div>
        )}
      </div>

      {/* List Footer */}
      {todos.length > 0 && (
        <div className="footer-bar">
          <span>총 {todos.length}개의 항목</span>
          <button
            type="button"
            className="clear-completed-btn"
            onClick={onClearCompleted}
          >
            완료 항목 비우기
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoList;
