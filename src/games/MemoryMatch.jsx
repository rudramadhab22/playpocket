import { useState, useEffect } from 'react';
import { saveScore, getBestScore } from '../utils/storage';
import './MemoryMatch.css';

const EMOJIS = ['🚀', '🛸', '👾', '🎮', '🎲', '🔮', '💎', '🌟'];

const generateDeck = () => {
  const deck = [...EMOJIS, ...EMOJIS]
    .map(emoji => ({ emoji, id: Math.random() }))
    .sort(() => Math.random() - 0.5);
  return deck;
};

const MemoryMatch = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('idle'); // idle, playing, won
  const [bestScore, setBestScore] = useState(null);

  useEffect(() => {
    setBestScore(getBestScore('memory-match'));
  }, []);

  const startGame = () => {
    setCards(generateDeck());
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameState('playing');
  };

  const handleCardClick = (index) => {
    if (gameState !== 'playing') return;
    if (flipped.length === 2) return;
    if (flipped.includes(index) || solved.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const match = cards[newFlipped[0]].emoji === cards[newFlipped[1]].emoji;

      setTimeout(() => {
        if (match) {
          setSolved(s => {
            const newSolved = [...s, ...newFlipped];
            if (newSolved.length === cards.length) {
              setGameState('won');
              const newBest = saveScore('memory-match', moves + 1, false); // false means lower is better
              setBestScore(newBest);
            }
            return newSolved;
          });
        }
        setFlipped([]);
      }, 1000);
    }
  };

  return (
    <div className="memory-match-container">
      <div className="game-header text-center">
        <h2>Memory Match</h2>
        <div className="stats-row">
          <span>Moves: {moves}</span>
          {bestScore && <span className="best-score">Best: {bestScore}</span>}
        </div>
      </div>

      {gameState === 'idle' && (
        <div className="game-overlay card text-center">
          <p className="mb-2">Match all pairs in the fewest moves possible.</p>
          <button className="btn-primary" onClick={startGame}>Start Game</button>
        </div>
      )}

      {gameState === 'won' && (
        <div className="game-overlay card text-center win-screen">
          <h3 className="mb-2" style={{ color: 'var(--color-success)' }}>You Won!</h3>
          <p className="mb-2">Total Moves: {moves}</p>
          <button className="btn-primary" onClick={startGame}>Play Again</button>
        </div>
      )}

      <div className={`memory-grid ${gameState !== 'playing' ? 'blurred' : ''}`}>
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || solved.includes(index);
          return (
            <div
              key={card.id}
              className={`memory-card ${isFlipped ? 'flipped' : ''} ${solved.includes(index) ? 'solved' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="memory-card-inner">
                <div className="memory-card-front">?</div>
                <div className="memory-card-back">{card.emoji}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryMatch;
