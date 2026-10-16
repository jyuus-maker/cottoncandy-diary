import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Sparkles, Pencil, CircleStop } from 'lucide-react';
import { COLORS, STORAGE_KEY, getTargetAngle, parseItems } from './wheel';
import './wheel.css';

export default function Wheel() {
  const [text, setText] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || ''; } catch { return ''; }
  });
  const [phase, setPhase] = useState('input');
  const [result, setResult] = useState(null);
  const [storageError, setStorageError] = useState(false);
  const disk = useRef(null);
  const angle = useRef(0);
  const stop = useRef(null);
  const items = parseItems(text);
  const spinning = phase === 'spinning' || phase === 'stopping';

  const handleTextChange = (value) => {
    setText(value);
    try {
      if (value) localStorage.setItem(STORAGE_KEY, value);
      else localStorage.removeItem(STORAGE_KEY);
      setStorageError(false);
    } catch { setStorageError(true); }
  };

  useEffect(() => {
    if (phase !== 'spinning' && phase !== 'stopping') return;
    let frame;
    let previous;
    const tick = (time) => {
      if (phase === 'spinning') {
        angle.current += previous === undefined ? 0 : Math.min(time - previous, 64) * 0.65;
      } else {
        const data = stop.current;
        data.started ??= time;
        const p = Math.min(1, (time - data.started) / 3200);
        angle.current = data.from + (data.to - data.from) * (1 - (1 - p) ** 3);
        if (p === 1) {
          disk.current.style.transform = `rotate(${angle.current}deg)`;
          setResult(data.winner);
          setPhase('result');
          return;
        }
      }
      previous = time;
      if (disk.current) disk.current.style.transform = `rotate(${angle.current}deg)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const start = () => {
    if (items.length < 2) return;
    setResult(null);
    setPhase('spinning');
  };
  const finish = () => {
    if (phase !== 'spinning' || stop.current?.pending) return;
    const index = Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) * items.length);
    stop.current = {
      pending: true,
      from: angle.current,
      to: getTargetAngle(angle.current, index, items.length),
      winner: items[index],
    };
    setPhase('stopping');
  };
  const retry = () => { stop.current = null; start(); };
  const edit = () => { stop.current = null; setResult(null); setPhase('input'); };

  return (
    <section className="candy-wheel" aria-labelledby="wheel-title">
      <header className="wheel-heading">
        <span className="wheel-eyebrow"><Sparkles size={16} /> A LITTLE HELP TO CHOOSE</span>
        <h1 id="wheel-title">솜사탕 룰렛</h1>
        <p>고민은 잠깐 내려놓고, 가볍게 골라봐요.</p>
      </header>
      {phase === 'input' ? (
        <div className="wheel-input-panel">
          <label htmlFor="wheel-options">무엇을 골라볼까요?</label>
          <p id="wheel-input-hint">메뉴도, 할 일도 좋아요. 한 줄에 하나씩 적어주세요.</p>
          <textarea id="wheel-options" aria-describedby="wheel-input-hint wheel-count" value={text}
            onChange={(e) => handleTextChange(e.target.value)} placeholder={'파스타 먹기\n산책 나가기\n책 읽기'} />
          <div className="wheel-input-meta" id="wheel-count"><span>{items.length}개의 선택지</span><span>{storageError ? '이 브라우저에서는 저장할 수 없어요' : '이 브라우저에 자동 저장돼요'}</span></div>
          <button className="wheel-primary" onClick={start} disabled={items.length < 2}><Sparkles size={18} /> 룰렛 돌리기</button>
          <p className="wheel-help">{items.length < 2 ? '선택지를 2개 이상 적으면 시작할 수 있어요.' : '같은 선택지를 여러 번 적으면 당첨 확률이 높아져요.'}</p>
        </div>
      ) : (
        <div className="wheel-stage">
          <div className="wheel-frame">
            <span className="wheel-pointer" aria-hidden="true" />
            <div className="wheel-disk" ref={disk}>
              <svg viewBox="0 0 300 300" role="img" aria-label={`${items.length}개의 선택지가 있는 룰렛`}>
                {items.map((name, i) => {
                  const size = 360 / items.length;
                  const a = (i * size - 90) * Math.PI / 180;
                  const b = ((i + 1) * size - 90) * Math.PI / 180;
                  return <g key={i}>
                    <path d={`M150 150 L${150 + 148 * Math.cos(a)} ${150 + 148 * Math.sin(a)} A148 148 0 ${size > 180 ? 1 : 0} 1 ${150 + 148 * Math.cos(b)} ${150 + 148 * Math.sin(b)} Z`} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth="1.5" />
                    <text x="242" y="150" dy=".35em" textAnchor="middle" transform={`rotate(${(i + 0.5) * size - 90} 150 150)`} fill="#493b59" fontSize={items.length > 16 ? 7 : 11} fontWeight="700">{name.length > 8 ? `${name.slice(0, 7)}…` : name}</text>
                  </g>;
                })}
              </svg>
            </div>
            <button className="wheel-stop" onClick={finish} disabled={phase !== 'spinning'} aria-label={phase === 'spinning' ? '룰렛 멈추기' : '룰렛 정지됨'}>{phase === 'spinning' ? <><CircleStop size={23} />STOP</> : phase === 'stopping' ? '두근두근' : 'PICK!'}</button>
          </div>
          <div className="wheel-result" role="status" aria-live="polite">
            {result ? <><span className="wheel-eyebrow">TODAY’S LITTLE PICK</span><h2>{result}</h2><p>오늘은 이걸로 해봐요 ☁️</p></> : <p>{phase === 'stopping' ? '솜사탕이 고르고 있어요…' : '마음이 가는 순간, STOP을 눌러주세요.'}</p>}
          </div>
          <div className="wheel-actions">
            {phase === 'result' && <button className="wheel-primary" onClick={retry}><RotateCcw size={17} /> 다시 돌리기</button>}
            <button className="wheel-secondary" onClick={edit} disabled={spinning}><Pencil size={16} /> 선택지 수정</button>
          </div>
        </div>
      )}
    </section>
  );
}
