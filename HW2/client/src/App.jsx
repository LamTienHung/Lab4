import useSwipeDeck from './hooks/useSwipeDeck.js';
import SwipeDeck from './components/SwipeDeck.jsx';
import ScoreBoard from './components/ScoreBoard.jsx';

export default function App() {
  const deck = useSwipeDeck();

  return (
    <>
      <header className="app-header">
        <h1>Hẹn Hò Nhưng Không Yêu</h1>
        <p className="tagline">Quẹt cho vui, không ai phải chịu trách nhiệm.</p>
      </header>

      <main className="app-main">
        {deck.status === 'loading' && (
          <p className="state-msg" role="status">Đang tải hồ sơ…</p>
        )}

        {deck.status === 'error' && (
          <div className="state-msg" role="alert">
            <p>Không tải được dữ liệu: {deck.error}</p>
            <p>Hãy kiểm tra server (HW2/server → <code>npm run dev</code>) rồi tải lại trang.</p>
            <button type="button" className="action-btn" onClick={() => window.location.reload()}>
              Tải lại
            </button>
          </div>
        )}

        {deck.status === 'ready' && (
          <>
            <ScoreBoard
              score={deck.score}
              stats={deck.stats}
              current={deck.currentIndex}
              total={deck.profiles.length}
              lastAction={deck.lastAction}
            />

            {deck.error && (
              <p className="toast-error" role="alert">{deck.error}</p>
            )}

            {deck.isFinished ? (
              <section className="finished" aria-labelledby="finished-title">
                <h2 id="finished-title">Hết hồ sơ rồi!</h2>
                <p>Tổng điểm của bạn: <strong>{deck.score}</strong></p>
                <div className="deck-actions">
                  <button type="button" className="action-btn btn-undo" onClick={deck.undoLastSwipe}>
                    ↶ Hoàn tác lượt cuối
                  </button>
                  <button type="button" className="action-btn btn-like" onClick={deck.restart}>
                    Chơi lại
                  </button>
                </div>
              </section>
            ) : (
              <SwipeDeck
                currentProfile={deck.currentProfile}
                nextProfile={deck.nextProfile}
                onSwipe={deck.swipe}
                onUndo={deck.undoLastSwipe}
                canUndo={deck.canUndo}
              />
            )}
          </>
        )}
      </main>
    </>
  );
}