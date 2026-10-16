import { useState } from 'react';
import { Check, Trash2, Edit3, Clock, Save, X } from 'lucide-react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {/* Checkbox */}
      <div className="todo-left">
        <button
          type="button"
          className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={() => onToggle(todo.id)}
          title={todo.completed ? '미완료로 변경' : '완료로 표시'}
        >
          {todo.completed && <Check size={16} strokeWidth={3} />}
        </button>

        {/* Body Info */}
        <div className="todo-body">
          <div className="todo-meta">
            {todo.category && (
              <span
                className="todo-category-badge"
                style={{
                  backgroundColor: todo.category.bg || '#FFD6E5',
                  color: todo.category.color || '#FF80A0',
                }}
              >
                {todo.category.name}
              </span>
            )}
            <span className="todo-timestamp">
              <Clock size={12} />
              {todo.createdAt}
            </span>
          </div>

          {isEditing ? (
            <input
              type="text"
              className="todo-edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              autoFocus
            />
          ) : (
            <span
              className="todo-text"
              onDoubleClick={() => setIsEditing(true)}
              title="더블클릭하여 수정하기"
            >
              {todo.text}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="todo-actions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="action-btn edit-btn"
              onClick={handleSave}
              title="저장"
            >
              <Save size={16} />
            </button>
            <button
              type="button"
              className="action-btn delete-btn"
              onClick={() => setIsEditing(false)}
              title="취소"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="action-btn edit-btn"
              onClick={() => setIsEditing(true)}
              title="수정하기"
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              className="action-btn delete-btn"
              onClick={() => onDelete(todo.id)}
              title="삭제하기"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
