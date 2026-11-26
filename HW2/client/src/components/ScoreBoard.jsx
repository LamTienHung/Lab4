import { SCORE_TABLE } from '../hooks/useSwipeDeck.js';

const LABELS = { LIKE: 'Thích', SUPER: 'Siêu thích', NOPE: 'Bỏ qua' };

export default function ScoreBoard({ score, stats, current, total, lastAction }) {
  return (
    <section className="scoreboard" aria-labelledby="scoreboard-title">
      <h2 id="scoreboard-title" className="visually-hidden">Bảng điểm</h2>

      <p className="score">
        <span className="score-label">Điểm</span>
        <strong className={score < 0 ? 'score-value is-negative' : 'score-value'}>
          {score}
        </strong>
      </p>

      <p className="progress">
        Thẻ {Math.min(current + 1, total)} / {total}
      </p>

      <dl className="stats">
        {Object.keys(LABELS).map((type) => (
          <div key={type} className={`stat stat-${type.toLowerCase()}`}>
            <dt>
              {LABELS[type]}{' '}
              <span className="stat-points">
                ({SCORE_TABLE[type] > 0 ? '+' : ''}{SCORE_TABLE[type]})
              </span>
            </dt>
            <dd>{stats[type]}</dd>
          </div>
        ))}
      </dl>

      {/* Thông báo cho screen reader sau mỗi lượt quẹt */}
      <p className="visually-hidden" aria-live="polite">
        {lastAction
          ? `${LABELS[lastAction.type]}. Điểm hiện tại ${score}.`
          : ''}
      </p>
    </section>
  );
}