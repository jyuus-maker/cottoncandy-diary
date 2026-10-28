import Wheel from '../features/wheel/Wheel';
import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import Header from '../features/todos/components/Header';
import Editor from '../features/todos/components/Editor';
import TodoList from '../features/todos/components/TodoList';
import { CATEGORIES } from '../features/todos/constants';
import '../styles/app.css';

const STORAGE_KEY = 'cotton_candy_todos_v1';

const DEFAULT_TODOS = [
  {
    id: '1',
    text: '창문 열고 환기하기 ☁️',
    completed: true,
    category: CATEGORIES[0], // 일상
    createdAt: '오후 09:00',
    timestamp: Date.now() - 3600000 * 2,
  },
  {
    id: '2',
    text: '포근한 솜사탕 라떼 마시기 ☕️',
    completed: false,
    category: CATEGORIES[4], // 힐링
    createdAt: '오후 09:15',
    timestamp: Date.now() - 3600000,
  },
  {
    id: '3',
    text: '미뤄둔 책 조금 읽기 🌸',
    completed: true,
    category: CATEGORIES[2], // 공부
    createdAt: '오후 09:17',
    timestamp: Date.now(),
  },
];

function App() {
  const [feature, setFeature] = useState(() => {
    try { return sessionStorage.getItem('cotton_candy_feature') === 'wheel' ? 'wheel' : 'todos'; }
    catch { return 'todos'; }
  });
  const selectFeature = (next) => {
    setFeature(next);
    try { sessionStorage.setItem('cotton_candy_feature', next); } catch { /* Storage may be unavailable. */ }
  };
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load local todos:', e);
    }
    return DEFAULT_TODOS;
  });

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest
  const [toastMsg, setToastMsg] = useState('');

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save todos:', e);
    }
  }, [todos]);

  // Toast Helper
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((current) => (current === msg ? '' : current));
    }, 2500);
  };

  // Trigger Pastel Confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FF80A0', '#9D65FE', '#4A90E2', '#32B38F', '#FFF2C6'],
      zIndex: 9999,
    });
  };

  // Add Todo
  const handleAddTodo = (text, category) => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      category,
      createdAt: formattedTime,
      timestamp: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  // Toggle Todo Completion
  const handleToggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const nextState = !todo.completed;
          if (nextState) {
            triggerConfetti();
            showToast('🎉 할 일을 완성했어요! 참 잘했어요 ☁️');
          }
          return { ...todo, completed: nextState };
        }
        return todo;
      })
    );
  };

  // Delete Single Todo
  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    showToast('🗑️ 할 일이 삭제되었습니다');
  };

  // Edit Todo Text
  const handleEditTodo = (id, newText) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
    showToast('✏️ 할 일이 수정되었습니다');
  };

  // Clear Completed Todos
  const handleClearCompleted = () => {
    const completedCount = todos.filter((t) => t.completed).length;
    if (completedCount === 0) {
      showToast('☁️ 완료된 항목이 없어요!');
      return;
    }
    setTodos((prev) => prev.filter((todo) => !todo.completed));
    showToast(`🧹 완료된 ${completedCount}개 항목을 모두 정리했어요!`);
  };

  // Filter & Search & Sort logic
  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        // Status filter
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
      })
      .filter((todo) => {
        // Search query
        if (!search.trim()) return true;
        const query = search.toLowerCase();
        return (
          todo.text.toLowerCase().includes(query) ||
          (todo.category && todo.category.name.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => {
        // Sort
        if (sortOrder === 'newest') return b.timestamp - a.timestamp;
        return a.timestamp - b.timestamp;
      });
  }, [todos, filter, search, sortOrder]);

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app-container">
      {/* Background Ambient Cloud Orbs */}
      <div className="bg-ambient-cloud cloud-1"></div>
      <div className="bg-ambient-cloud cloud-2"></div>
      <div className="bg-ambient-cloud cloud-3"></div>

      {/* Floating Sparkles */}
      <div className="floating-sparkle" style={{ top: '15%', left: '8%' }}>✨</div>
      <div className="floating-sparkle" style={{ top: '25%', right: '10%' }}>🌸</div>
      <div className="floating-sparkle" style={{ bottom: '20%', left: '12%' }}>☁️</div>

      {/* Main Glassmorphic Card */}
      <div className="diary-cover">
        <nav className="app-feature-nav" aria-label="다이어리 도구">
          <button aria-pressed={feature === 'todos'} onClick={() => selectFeature('todos')}>솜사탕 투두</button>
          <button aria-pressed={feature === 'wheel'} onClick={() => selectFeature('wheel')}>솜사탕 룰렛</button>
        </nav>
        <main className="main-card">
        {feature === 'wheel' ? <Wheel /> : <>
        {/* Header (Date/Clock + Progress) */}
        <Header totalCount={todos.length} completedCount={completedCount} />

        {/* Editor (Single line Todo creation + Category tags) */}
        <Editor onAddTodo={handleAddTodo} showToast={showToast} />

        {/* Todo List (Search bar + Filters + Items) */}
        <TodoList
          todos={filteredTodos}
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          onEditTodo={handleEditTodo}
          onClearCompleted={handleClearCompleted}
        />
        </>}
        </main>
      </div>

      {/* Toast Notification */}
      {toastMsg && <div className="toast-msg">{toastMsg}</div>}
    </div>
  );
}

export default App;
