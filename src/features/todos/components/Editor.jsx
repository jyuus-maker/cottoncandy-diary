import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CATEGORIES } from '../constants';

const Editor = ({ onAddTodo, showToast }) => {
  const [text, setText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      showToast('☁️ 할 일을 입력해 주세요!');
      return;
    }

    onAddTodo(text.trim(), selectedCategory);
    setText('');
    showToast('🌸 포근한 할 일이 추가되었습니다!');
  };

  return (
    <form className="editor-section" onSubmit={handleSubmit}>
      {/* Category Pills */}
      <div className="tag-selector">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`tag-pill ${selectedCategory.id === cat.id ? 'active' : ''}`}
            style={
              selectedCategory.id === cat.id
                ? { color: cat.color, borderColor: cat.color, background: cat.bg }
                : {}
            }
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <div className="editor-input-row">
        <input
          type="text"
          className="editor-input"
          placeholder="오늘 할 일을 포근하게 적어보세요... ✨"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="editor-add-btn">
          <Plus size={18} />
          <span>추가하기</span>
        </button>
      </div>
    </form>
  );
};

export default Editor;
